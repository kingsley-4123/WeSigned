import { AttendanceSession } from "../models/attendance_session.js";
import { Attendance, validateAttendance } from "../models/attendance.js";
import { User } from "../models/user.js";   
import { durationValid} from "../utils/attendance-duration-calculator.js";
import lodash from 'lodash';


export async function getAttendances(req, res) {
    const {specialId } = req.params;

    const attendanceList = await Attendance.find({ special_id: specialId, lecturer_id: req.user._id  })
        .select('-__v -lecturer_id -student_id')
        .sort({ full_name: 1 }); // Sort by full_name in ascending order
    
    if (!attendanceList) return res.status(404).send('No attendance records found.');

    return res.json(attendanceList);    
}

export async function markAttendance(req, res) {
    const {error} = validateAttendance(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const { specialId } = req.params;
    const attSessionObj = await AttendanceSession.findOne({special_id: specialId});
    if (!attSessionObj) return res.status(401).send('Attendance with the given ID was not found.');

    const alreadyMarked = await Attendance.findOne({ lecturer_id: attSessionObj.creator_id, student_id: req.user._id });
    if (alreadyMarked) return res.status(400).send('Attendance already marked.');  
    
    const withinRange = await AttendanceSession.findOne({
        special_id: specialId,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [req.body.longitude, req.body.latitude]
                },
                $maxDistance: attSessionObj.range
            }
        }
    }); 
    if (!withinRange) return res.status(400).send('You are out of range.');

    const newAttendanceObj = new Attendance(lodash.pick(req.body, ['fullName', 'matricNo']));
    newAttendanceObj.lecturer_id = attSessionObj.creator_id;
    newAttendanceObj.student_id = req.user._id;
    newAttendanceObj.special_id = specialId;

    durationValid(attSessionObj);
    const attendanceObj = await newAttendanceObj.save();
    if (!attendanceObj) return res.status(500).send('Attendance not marked.');

    let lecturer = await User.findById({_id: attSessionObj.creator_id});
    if (!lecturer) return res.status(404).send('Lecturer not found.');
    lecturer = lodash.pick(lecturer, ['firstname', 'middlename', 'surname']);
    lecturer = `${lecturer.surname} ${lecturer.middlename ? lecturer.middlename + ' ' : ''}${lecturer.firstname}`;  

    const today = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options).replace(","," ");

    return res.json({
        user: lodash.pick(attendanceObj, ['full_name', 'matric_no']),
        student: {
            lecturer: lecturer,
            date: formattedDate,
            title: attSessionObj.attendance_name
        },
        message: 'Attendance marked successfully.'
    });
}
