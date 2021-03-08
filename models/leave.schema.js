import mongoose from "mongoose"

const leaveSchema = {
    leaveType: { type: String},
    leaveTaken: { type: Number }
}

export const leaveModel = mongoose.model("leave", leaveSchema, 'leave')