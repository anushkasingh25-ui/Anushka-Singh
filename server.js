
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.use(express.static(process.cwd()));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/index.html");
});


transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Error:", error.message);
    } else {
        console.log("Resend SMTP is ready!");
    }
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

      
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

    
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.RECEIVER_EMAIL,
            replyTo: email,
            subject: `Portfolio Contact: ${subject}`,

            text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!"
        });

    } catch (error) {
        console.log("Email Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Email could not be sent. Please try again."
        });
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
