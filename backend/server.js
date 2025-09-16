import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import notesRouter from "./routes/note.routes.js"
import tenantRouter from "./routes/tenant.routes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})

mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection

db.on("open", () => {
    console.log("MongoDB Connected")
})

db.on("error", () => {
    console.log("MongoDB not connected")
})

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/auth", authRouter)
app.use("/notes", notesRouter)
app.use("/tenants", tenantRouter)