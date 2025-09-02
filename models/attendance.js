import mongoose from 'mongoose';
import Joi from 'joi';

export const Attendance = mongoose.model('attendance', new mongoose.Schema({
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
}));

export function validateAttendance(attendance) {
    const schema = Joi.object({
        full_name: Joi.string().min(10).required(),
        matric_no: Joi.string().min(11).required(),
    });

    return schema.validate(attendance);
}

