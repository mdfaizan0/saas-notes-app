import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["Admin", "Member"],
        default: "Member"
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        default: null
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User