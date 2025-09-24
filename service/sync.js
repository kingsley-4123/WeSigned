import { Attendance } from "../models/attendance";
import { AttendanceSession } from "../models/attendance_session";
import bcrypt from "bcrypt";

export async function syncAttendance(req, res) {
    try {
        const records = req.body.items;
        console.log("Sync records: ", records);
        if (!Array.isArray(records)) return res.status(400).json({ message: 'Invalid data format' });
        
        const docs = records.map(record => ({
            full_name: record.fullName,
            matric_no: record.regNo,
            special_id: record.sessionId,
            signedAt: record.signedAt,
            attendance_name: record.sessionName,
            lecturer_id: null,
            student_id: record.studentId
        }));

        await Attendance.insertMany(docs, { ordered: false });
        res.status(200).json({ success: true, syncedCount: records.length });
    } catch (err) {
        console.error('Attendance sync failed: ', err);
        res.status(500).json({ message: 'Server error' });
    }
}


export async function syncSession(req, res) {
    try {
        const records = req.body.items;
        if (!Array.isArray(records)) return res.status(400).json({ message: 'Invalid data format' });

        // Map each record to the schema
        const docs = records.map(record => ({
            creatorr_id: record.lecturerId,
            attendance_name: record.attendanceName,
            special_id: record.id,
            createdAt: record.createdAt,
            duration_unit: record.unit,
            duration: record.duration,
            range: 0,
            location: { type: 'Point', coordinates: [0, 0] } // Placeholder coordinates 
        }));

        await AttendanceSession.insertMany(docs, { ordered: false });
        res.status(200).json({ success: true, syncedCount: docs.length });
    } catch (err) {
        console.error('Session sync failed: ', err);
        res.status(500).json({ message: 'Server error' });
    }
}


export async function getSyncedAttendance(req, res) {
    const { specialId, attendanceName } = req.params;
    const attSession = await AttendanceSession.findOne({
        special_id: specialId,
        attendance_name: attendanceName
    });

    if (!attSession) return res.status(404).json({ message: "Sorry, session not available." });

    let attendance = await Attendance.find({
        special_id: specialId,
        attendance_name: attendanceName
    })
        .select("full_name matric_no signedAt offlineSignedAt")
        .sort("full_name");
    
    const newAttendance = attendance.filter((s) => s.signedAt > attSession.createdAt);
    if (newAttendance.length === 0) return res.status(404).json({ message: "Sorry, attendance not available." });

    res.json({ success: true, attendanceList: newAttendance });
}