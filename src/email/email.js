import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

let newEmail = {
  to: '',
  from: 'cohort10.boolean@gmail.com',
  subject: '',
  text: '',
  html: ''
}

sgMail
  .send()
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

export const generateEmail = async (content) => {
  const messageContent = content
  if (!content.to) {
    return console.log('please provide recipient of the notification')
  }
  if (!content.subject) {
    return console.log('please provide subject of the notification')
  }
  if (!content.text) {
    return console.log('please provide the messageontent of the notification')
  }
  if (content.subject === 'Cohort Change') {
    cohortChangeMessage(messageContent)
  }
  if (content.subject === 'New Message') {
    newPostMessage(messageContent)
  }
  sgMail(newEmail)
  return console.log(`email sent to ${newEmail.to}: `, newEmail)
}

const cohortChangeMessage = (content) => {
  console.log('cohort changing')
  newEmail = {
    ...newEmail,
    to: content.to,
    subject: 'There has been a change to your cohort!',
    text: content.text,
    html: content.html
  }
}

const newPostMessage = (content) => {
  console.log('new post')
  newEmail = {
    ...newEmail,
    to: content.to,
    subject: 'There is a new post!',
    text: content.text,
    html: content.html
  }
}
