import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sgMail
  .send()
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

export const generateEmail = async (req, res) => {
  const { to, subject, text, html } = req.body
  const newEmail = {
    to: to,
    from: 'cohort10.boolean@gmail.com',
    subject: subject,
    text: text,
    html: html
  }
  if (!newEmail.to) {
    return sendMessageResponse(
      res,
      400,
      'please provide recipient of the notification'
    )
  }
  if (!newEmail.subject) {
    return sendMessageResponse(
      res,
      400,
      'please provide subject of the notification'
    )
  }
  if (!newEmail.text) {
    return sendMessageResponse(
      res,
      400,
      'please provide the messageontent of the notification'
    )
  }
  if (subject === 'Cohort Change') {
    cohortChangeMessage()
  }
  if (subject === 'New Message') {
    newPostMessage()
  }
  sgMail(newEmail)
  return sendDataResponse(res, 200, `email sent to ${newEmail.to}: `, newEmail)
}

const cohortChangeMessage = () => {
  console.log('cohort changing')
}

const newPostMessage = () => {
  console.log('new post')
}
