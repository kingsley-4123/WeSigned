import mongoose from 'mongoose';
import Joi from 'joi';

const attendanceSchema = new mongoose.Schema({
    full_name: {
        type: String,
        minlength: 10,
        required: true
    },
    matric_no: {
        type: String,
        minlength: 11,
        required: true
    },
    lecturer_id: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    special_id: {
        type: String,
        required: true
    },
    signedAt: {
        type: Date,
        default: Date.now  
    }
});

const sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;

attendanceSchema.index({ signedAt: 1 }, { expireAfterSeconds: sixMonthsInSeconds });

export const Attendance = mongoose.model('attendance', attendanceSchema);

export function validateAttendance(attendance) {
    const schema = Joi.object({
        full_name: Joi.string().min(10).required(),
        matric_no: Joi.string().min(11).required(),
    });

    return schema.validate(attendance);
}

