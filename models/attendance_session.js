import mongoose from "mongoose";
import Joi from "joi";

const attendanceSchema = new mongoose.Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assuming your user/lecturer model is 'User'
        required: true
    },
    attendance_name: {
        type: String,
        required: true
    },
    special_id: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number, // in minutes or milliseconds – your choice
        required: true
    },
    duration_unit: {
        type: String,
        enum: ['hours', 'minutes', 'seconds'],
        required: true
    },
    range: {
        type: Number, // in meters, e.g., 100
        required: true,
        default: 100
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

attendanceSchema.index({ location: '2dsphere' }); // Enable geospatial queries

const sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;

attendanceSchema.index({ createdAt: 1 }, { expireAfterSeconds: sixMonthsInSeconds });

export const AttendanceSession = mongoose.model('attendance-session', attendanceSchema);

export function validateSession(session) {
    const schema = Joi.object({
        attendance_name: Joi.string().required(),
        duration: Joi.number().positive().required(),
        range: Joi.number().positive().default(100),
        duration_unit: Joi.string().valid(['hours', 'minutes', 'seconds']).required(),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
    });

    return schema.validate(session);
}