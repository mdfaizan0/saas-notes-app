import mongoose from "mongoose";

const tenantSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    subscription: {
        type: String,
        required: true,
        enum: ["Free", "Pro"],
        default: "Free"
    }
}, { timestamps: true })

const Tenant = mongoose.model("Tenant", tenantSchema)

export default Tenant