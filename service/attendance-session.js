import { AttendanceSession, validateSession } from "../models/attendance_session.js";
import createUniqueSpecialId from "../utils/attendance-special-id-generator.js";
import { User } from "../models/user.js";
import { remainingTime } from "../utils/attendance-duration-calculator.js";
import deleteOldDocuments from "../utils/deleteOldDocuments.js";
import lodash from 'lodash';

export async function getAttendanceSession(req, res) {
    const attSessionObj = await AttendanceSession.findOne({ special_id: req.params.special_id });
    if (!attSessionObj) return res.status(401).send('Attendance with the given ID was not found.');

    remainingTime(attSessionObj);
}

export async function createSession(req, res) {
    const { error } = validateSession(req.body.payload);
    if (error) return res.status(400).send(error.details[0].message);

    const specialId = await createUniqueSpecialId();

    const {name, duration, unit, range, latitude, longitude} = req.body.payload;

    const sessionObj = new AttendanceSession({
        lecturer_id: req.user.id,
        attendance_name: name,
        special_id: specialId,
        duration: duration,
        duration_unit: unit,
        range: range,
        location: {
            type: "Point",
            coordinates: [longitude, latitude]
        }
    }); 

    let lecturer = await User.findById(req.user._id);
    if (!lecturer) return res.status(404).send('Lecturer not found.');
    lecturer = lodash.pick(lecturer, ['firstname', 'middlename', 'surname']);
    lecturer = `${lecturer.surname} ${lecturer.middlename ? lecturer.middlename + ' ' : ''}${lecturer.firstname}`;  

    const today = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options).replace(","," ");

    const attSession = lodash.pick(sessionObj, ['lecturer_id', 'special_id', 'duration', 'attendance_name']);
    return res.json({
        attSession,
        lecturer,
        date: formattedDate,
        message: "Session created successfully."
    });
}

/**
 * import the node-cron package.
 * 
 * cron.schedule('0 0 * * *', ()=>{
 *  deleteOldDocuments(AttendanceSession);
 * });
 */