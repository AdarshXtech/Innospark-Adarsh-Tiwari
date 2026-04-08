import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation(
  email: string,
  attendeeName: string,
  eventTitle: string,
  qrCode: string
) {
  return resend.emails.send({
    from: 'LocalTix <noreply@localtix.com>',
    to: email,
    subject: `Your ticket for ${eventTitle} is ready!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmed!</h2>
        <p>Hi ${attendeeName},</p>
        <p>Your ticket for <strong>${eventTitle}</strong> has been confirmed.</p>
        <div style="margin: 30px 0; text-align: center;">
          <p>Please show this QR code at the event:</p>
          <img src="${qrCode}" alt="QR Code" style="max-width: 300px;" />
        </div>
        <p>See you at the event!</p>
        <p>LocalTix Team</p>
      </div>
    `,
  })
}
