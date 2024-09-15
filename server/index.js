import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import nodemailer from 'nodemailer'
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}))

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);


const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_USER,
    },
    maxConnections: 1
})

app.post('/send-otp', async (req, res) => {
    const { email, otp } = req.body;
    // console.log(process.env.EMAIL_USER);
    // console.log(process.env.PASS_USER);
    // console.log(process.env.ORIGIN);

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your chat app OTP',
            text: `Your OTP is ${otp}`
        });
        res.status(200).send({ success: true })
    } catch (error) {
        // res.status(500).send({ success: false, message: error.message });
        console.log(error.message);
    }
})

const server = app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})

setupSocket(server);

mongoose.connect(databaseURL).then(() => console.log('DB Connection successful')).catch(err => console.log(err.message));
