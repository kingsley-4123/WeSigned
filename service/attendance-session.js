import { AttendanceSession, validateSession } from "../models/attendance_session.js";
import createUniqueSpecialId from "../utils/attendance-special-id-generator.js";
import { remainingTime } from "../utils/attendance-duration-calculator.js";
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

    const attSession = lodash.pick(sessionObj, ['lecturer_id', 'special_id', 'duration']);
    return res.json(attSession);
}
