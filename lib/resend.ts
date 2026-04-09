import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

export async function sendBookingConfirmation(
  email: string,
  name: string,
  eventTitle: string,
  qrCode: string
) {
  await resend.emails.send({
    from: 'LocalTix <noreply@localtix.app>',
    to: email,
    subject: `Your ticket for ${eventTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>You're in, ${name}!</h2>
        <p>Here's your ticket for <strong>${eventTitle}</strong>.</p>
        <p>Show the QR code below at the entrance:</p>
        <img src="${qrCode}" alt="QR Code" style="width: 200px; height: 200px;" />
        <p style="color: #888; font-size: 12px; margin-top: 32px;">LocalTix · Your local event companion</p>
      </div>
    `,
  })
}
