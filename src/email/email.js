import sgMail from '@sendgrid/mail'
import { SENDER_EMAIL, SENDGRID_API_KEY } from '../utils/senderEmail.js'
sgMail.setApiKey(SENDGRID_API_KEY)

let newEmail = {
  to: '',
  from: `${SENDER_EMAIL}`,
  subject: '',
  text: '',
  html: ''
}

const sendEmail = () => {
  sgMail
    .send(newEmail)
    .then(() => {
      console.info(`Email sent to ${newEmail.to}`)
    })
    .catch((error) => {
      console.error(error)
    })
}

export const generateEmail = async (content) => {
  const messageContent = content
  if (!content.to) {
    throw new Error('please provide recipient of the notification')
  }
  if (!content.subject) {
    throw new Error('please provide subject of the notification')
  }
  if (!content.text) {
    throw new Error('please provide message content of the notification')
  }

  newEmail.html = convertToHTML(content.text)

  if (content.subject === 'cohortChange') {
    cohortChangeMessage(messageContent)
  }
  if (content.subject === 'newMessage') {
    newPostMessage(messageContent)
  }
  sendEmail()
  return console.info(`email sent: `, newEmail)
}

const cohortChangeMessage = async (content) => {
  newEmail = {
    ...newEmail,
    to: content.to,
    subject: 'There has been a change to your cohort!',
    text: content.text
  }
}

const newPostMessage = async (content) => {
  newEmail = {
    ...newEmail,
    to: content.to,
    subject: 'There is a new post!',
    text: content.text
  }
}

const convertToHTML = (text) => {
  const html = `<div>${text}</div>`
  return html
}
