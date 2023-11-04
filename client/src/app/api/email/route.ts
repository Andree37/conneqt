import nodemailer from 'nodemailer'

export async function POST(req: Request) {
    const {subject, message, emailTo} = await req.json();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: emailTo,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        return new Response('Email sent successfully', {status: 200})
    } catch (error: any) {
        console.error(error)
        return new Response(error.toString(), {status: 500});
    }

}
