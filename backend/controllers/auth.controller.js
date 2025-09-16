import User from "../models/User.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export async function register(req, res) {
    const { name, email, password } = req.body

    try {
        const userExist = await User.findOne({ email })
        if (userExist) return res.status(409).json({ message: "User already exists, please login instead." })

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({ name, email, password: hashedPassword })

        return res.status(201).json({ message: "User Registered", user })
    } catch (error) {
        return res.status(500).json({ message: "Server error while signing in", error: error.message })
    }
}

export async function login(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter the required fields." })
    }

    try {
        let user = await User.findOne({ email }).select("+password").populate("tenantId")
        if (!user) return res.status(404).json({ message: "Unable to find the user, please check your credentials or Sign Up" })

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return res.status(401).json({ message: "Unable to verify the user, please check your password" })

        const userObj = user.toObject()
        delete userObj.password

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId || null
            },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
        )
        return res.status(200).json({ message: "User authorized", token, user: userObj })
    } catch (error) {
        return res.status(500).json({ message: "Server error while signing in", error: error.message })
    }
}