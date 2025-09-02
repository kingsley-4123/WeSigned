import Excel from 'exceljs';
import dayjs from 'dayjs';
import { Attendance } from '../models/attendance.js';

// ---- Excel Export ---
export default async function excelExport(req, res) {
    try {
        const { specialId, lecturerId } = req.params;
        console.log(specialId, lecturerId);
        const students = await Attendance.find({ special_id:specialId, lecturer_id:lecturerId })
            .select('-__v -lecturer_id -student_id')
            .sort('full_name');
        if (!students) return res.status(401).json({ message: "No attedance record found." });
        console.log(students);

        const wb = new Excel.Workbook();
        
        wb.calcProperties.fullCalcOnLoad = true;
        const ws = wb.addWorksheet("Attendance");

        ws.columns = [
        { header: "Full Name", key: "fullName", width: 22 },
        { header: "Student ID", key: "studentId", width: 14 },
        { header: "Signed At", key: "signedAt", width: 20 },
        ];

        students.forEach(s => ws.addRow({
            fullName: s.full_name,
            studentId: s.matric_no,
            signedAt: s.signedAt.toISOString(),
        }));
        ws.getRow(1).font = { bold: true };

        res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.attachment(`attendance_${dayjs().format("YYYY-MM-DD_HH-mm")}.xlsx`);
        await wb.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ message: err });
    }
}
        