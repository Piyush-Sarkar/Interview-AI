const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(express.json())
app.use(cookieParser())


if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }))
}

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../../frontend/dist")))
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"))
    });
}



module.exports = app