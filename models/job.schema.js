import mongoose from "mongoose"

const jobSchema = {
  Name: { type: String },
  Description: { type: String }
}

export const JobModel = mongoose.model("job", jobSchema, 'job');