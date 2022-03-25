import sgMail from '@sendgrid/mail'

export async function sendMail(to:string, from:string, templateId:string, templateData) {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to,
        from,
        templateId,
        dynamic_template_data: templateData
    }

    await sgMail.send(msg)
}

export async function sendToken(token:string, email:string) {
    
    const link = `${process.env.BASE_URL}/auth/verifyemail?token=${token}`

    await sendMail(email, 'bobhascome@gmail.com', 'd-96e7dd8a50bf4e26b8b8a44135c48838', {link})
}

export async function sendPasswordResetToken(token:string, email:string) {

    const link = `${process.env.BASE_URL}/auth/forgot-password?token=${token}`

    await sendMail(email, 'bobhascome@gmail.com', 'd-103bf761fca647c6b07810e556d22e82', {link})
}