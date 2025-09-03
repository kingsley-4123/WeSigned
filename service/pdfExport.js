import PdfPrinter from "pdfmake";
import { Attendance } from "../models/attendance.js";
import { AttendanceSession } from "../models/attendance_session.js";
import dayjs from "dayjs";

// ---- PDF Export ----
const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

export default async function pdfExport(req, res) {
    try {
        const { specialId, lecturerId } = req.params;

         const attSession = await AttendanceSession.findOne({ special_id: specialId });
        if (!attSession) return res.status(404).json({ message: "No session found." });
        
        const students = await Attendance.find({ special_id:specialId, lecturer_id:lecturerId })
            .select('-__v -lecturer_id -student_id')
            .sort('full_name');
        if (!students) return res.status(401).json({ message: "No attedance record found." });

        const body = [
            ["Serial No","Full Name", "Student ID", "Signed At"],
            ...students.map((s, i) => [
                i + 1,
                s.full_name,
                s.matric_no,
                dayjs(s.signedAt).format("YYYY-MM-DD HH:mm"),
            ]),
        ];

        const docDefinition = {
        pageSize: "A4",
        content: [
            { text: "Attendance Export", style: "header" },
            {
            table: { headerRows: 1, widths: ["auto","*", "auto","auto"], body },
            layout: "lightHorizontalLines",
            },
        ],
        styles: { header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] } },
        defaultStyle: { font: "Helvetica", fontSize: 14 },
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        res.setHeader("Content-Type", "application/pdf");
        res.attachment(`${attSession.attendance_name}_${dayjs().format("YYYY-MM-DD_HH-mm")}.pdf`);

        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (err) {
        next(err);
    }
}
