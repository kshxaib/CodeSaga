import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.route.js"
import executeRoutes from "./routes/execute.routes.js"

dotenv.config()
const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("Welcome to the SkillForge 🔥")
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code", executeRoutes)

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 8080")
})