import PdfPrinter from "pdfmake";
import { Attendance } from "../models/attendance.js";
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

export default async function(req, res) {
    try {
        const { specialId, lecturerId } = req.params;
        const students = await Attendance.find({ special_id:specialId, lecturer_id:lecturerId })
            .select('-__v -lecturer_id -student_id')
            .sort('full_name');
        if (!students) return res.status(401).json({ message: "No attedance record found." });

        const body = [
        ["Full Name", "Signed At", "Student ID"],
        ...students.map(s => [
            s.matric_no,
            s.full_name,
            dayjs(s.signedAt).format("YYYY-MM-DD HH:mm"),
        ]),
        ];

        const docDefinition = {
        pageSize: "A4",
        content: [
            { text: "Attendance Export", style: "header" },
            {
            table: { headerRows: 1, widths: [80, 80, "*", 60, 80], body },
            layout: "lightHorizontalLines",
            },
        ],
        styles: { header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] } },
        defaultStyle: { font: "Helvetica", fontSize: 10 },
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        res.setHeader("Content-Type", "application/pdf");
        res.attachment(`attendance_${dayjs().format("YYYY-MM-DD_HH-mm")}.pdf`);

        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (err) {
        next(err);
    }
}
