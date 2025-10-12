import nodemailer from "nodemailer";

export const sendEmail = async(to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Social Network" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
        });

        console.log("✅ Email đã được gửi đến:", to);
    } catch (err) {
        console.error("❌ Lỗi gửi email:", err);
        throw new Error("Không gửi được email!");
    }
};