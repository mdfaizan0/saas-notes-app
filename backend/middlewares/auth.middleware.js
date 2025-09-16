import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/User.model.js"

dotenv.config()

export async function protect(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" })
    }

    try {
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id).select("name email role tenantId")
        if (!user) return res.status(401).json({ message: "User no longer exists" })

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token", error: error.message })
    }
}

export function authorizeRoles(...roles) {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You are not authorized to access this resource" })
        }
        next()
    }
}