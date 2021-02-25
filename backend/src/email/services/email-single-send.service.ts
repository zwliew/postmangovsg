import { EmailService } from '@email/services'
import { MailToSend } from '@core/interfaces'

async function sendSingleMessage({
  subject,
  body,
  from,
  recipient,
}: {
  subject: string
  body: string
  from: string
  recipient: string
}): Promise<void> {
  const mailToSend: MailToSend = {
    subject,
    from: from,
    body,
    recipients: [recipient],
  }
  const isEmailSent = await EmailService.sendEmail(mailToSend)
  if (!isEmailSent) {
    throw new Error(`Could not send email to ${recipient}`)
  }
}

export const EmailSingleSendService = {
  sendSingleMessage,
}
