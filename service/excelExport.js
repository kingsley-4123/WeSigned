import Excel from 'exceljs';
import dayjs from 'dayjs';
import { Attendance } from '../models/attendance.js';
import { AttendanceSession } from '../models/attendance_session.js';

// ---- Excel Export ---
export async function excelExport(req, res) {
    try {
        const { specialId } = req.params;

        const attSession = await AttendanceSession.findOne({ special_id: specialId });
        if (!attSession) return res.status(404).json({ message: "No session found." });

        const students = await Attendance.find({ special_id:specialId, lecturer_id:attSession.creator_id })
            .select('-__v -lecturer_id -student_id')
            .sort('full_name');
        if (!students) return res.status(404).json({ message: "No attedance record found." });
        console.log(students);

        const wb = new Excel.Workbook();
        
        wb.calcProperties.fullCalcOnLoad = true;
        const ws = wb.addWorksheet("Attendance");

        ws.columns = [
            { header: "Serial No", key: "SerialNo"},
            { header: "Full Name", key: "fullName" },
            { header: "Reg No", key: "regNo"},
            { header: "Signed At", key: "signedAt"},
        ];

        students.forEach((s, i) => ws.addRow({
            SerialNo: i + 1,
            fullName: s.full_name,
            regNo: s.matric_no,
            signedAt: dayjs(s.signedAt).format("YYYY-MM-DD HH:mm"),
        }));
        ws.getRow(1).font = { bold: true };

        // Auto-fit column widths
        ws.columns.forEach(column => {
            let maxLength = 10;
            column.eachCell({ includeEmpty: true }, cell => {
                const cellValue = cell.value ? cell.value.toString() : "";
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength + 2;
        });

        const fileName = `${attSession.attendance_name}_${dayjs().format("YYYY-MM-DD_HH-mm")}.xlsx`;
        console.log('FILENAME', fileName);
        res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        await wb.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
}


export async function offlineExcelExport(req, res) {
    try {
        const { specialId, attendanceName } = req.params;
        const attSession = await AttendanceSession.findOne({ special_id: specialId });
        if (!attSession) return res.status(404).json({ message: "No session found." });

        const students = await Attendance.find({ special_id:specialId, attendance_name: attendanceName })
            .select('full_name matric_no signedAt')
            .sort('full_name');
        if (!students) return res.status(404).json({ message: "No attedance record found." });
        console.log(students);

        const wb = new Excel.Workbook();
        
        wb.calcProperties.fullCalcOnLoad = true;
        const ws = wb.addWorksheet("Attendance");

        ws.columns = [
            { header: "Serial No", key: "SerialNo"},
            { header: "Full Name", key: "fullName" },
            { header: "Reg No", key: "regNo"},
            { header: "Signed At", key: "signedAt"},
        ];

        students.forEach((s, i) => ws.addRow({
            SerialNo: i + 1,
            fullName: s.full_name,
            regNo: s.matric_no,
            signedAt: dayjs(s.signedAt).format("YYYY-MM-DD HH:mm"),
        }));
        ws.getRow(1).font = { bold: true };

        // Auto-fit column widths
        ws.columns.forEach(column => {
            let maxLength = 10;
            column.eachCell({ includeEmpty: true }, cell => {
                const cellValue = cell.value ? cell.value.toString() : "";
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength + 2;
        });

        const fileName = `${attSession.attendance_name}_${dayjs().format("YYYY-MM-DD_HH-mm")}.xlsx`;

        console.log('FILENAME', fileName);
        res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        await wb.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
}