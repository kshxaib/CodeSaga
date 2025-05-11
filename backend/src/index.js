import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.route.js"
import executeRoutes from "./routes/execute.routes.js"
import submissionRoutes from "./routes/submission.route.js"
import playlistRoutes from "./routes/playlist.route.js"
import userRoutes from "./routes/user.route.js"
import reportRoutes from "./routes/report.route.js"

dotenv.config()
const app = express()

app.use(express.json({
    limit: "30mb",
}))
app.use(cors({
    origin: process.env.FRONTEND_URL,   
    credentials: true
}))

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("Welcome to the SkillForge 🔥")
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code", executeRoutes)
app.use("/api/v1/submission", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/problems/report", reportRoutes)

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 8080")
})