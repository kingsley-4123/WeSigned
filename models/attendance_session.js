import mongoose from "mongoose";
import Joi from "joi";

const attendanceSchema = new mongoose.Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // assuming your user/lecturer model is 'User'
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
    },
    duration_unit: {
        type: String,
        enum: ['hours', 'minutes', 'seconds']
    },
    range: {
        type: Number, // in meters, e.g., 100
        default: 100
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        }
    },
    createdAt: {
        type: Number,
        default: Date.now
    }
});

attendanceSchema.index({ location: '2dsphere' }); // Enable geospatial queries

const sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;

attendanceSchema.index({ createdAt: 1 }, { expireAfterSeconds: sixMonthsInSeconds });

export const AttendanceSession = mongoose.model('attendance-session', attendanceSchema);

export function validateSession(session) {
    const schema = Joi.object({
        name: Joi.string().required(),
        duration: Joi.number().positive().required(),
        range: Joi.number().positive().default(100),
        unit: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    });

    return schema.validate(session);
}