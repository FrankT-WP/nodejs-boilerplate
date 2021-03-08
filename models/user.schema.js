import mongoose from "mongoose"

const userSchema = {
    Email: { type: String },
    FirstName: { type: String },
    LastName: { type: String },
    ContactNo: { type: String },
    salt: { type: String },
    hash: { type: String },
    UserLevel: { type: Number }, // 1 System Admin | 2 Editor | 3 End User
    DateCreated: { type: Date},
}

export const UserModel = mongoose.model("user", userSchema, 'user')