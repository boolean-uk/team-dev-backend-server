import sgMail from '@sendgrid/mail'
import SENDER_EMAIL from '../utils/senderEmail.js'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
      console.log(`Email sent to ${newEmail.to}`)
    })
    .catch((error) => {
      console.error(error)
    })
}

export const generateEmail = async (content) => {
  const messageContent = content
  if (!content.to) {
    return console.log('please provide recipient of the notification')
  }
  if (!content.subject) {
    return console.log('please provide subject of the notification')
  }
  if (!content.text) {
    return console.log('please provide the message content of the notification')
  }

  newEmail.html = convertToHTML(content.text)

  if (content.subject === 'cohortChange') {
    cohortChangeMessage(messageContent)
  }
  if (content.subject === 'newMessage') {
    newPostMessage(messageContent)
  }
  sendEmail()
  return console.log(`email sent: `, newEmail)
}

const cohortChangeMessage = async (content) => {
  console.log('cohort changing')
  newEmail = {
    ...newEmail,
    to: content.to,
    subject: 'There has been a change to your cohort!',
    text: content.text
  }
}

const newPostMessage = async (content) => {
  console.log('new post')
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
