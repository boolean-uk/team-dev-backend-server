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

export const generateEmail = async (recipient, subject, text, html) => {
  const newEmail = {
    to: recipient,
    from: 'cohort10.boolean@gmail.com',
    subject: subject,
    text: text,
    html: html
  }
  if (!newEmail.to) {
    return console.log('please provide recipient of the notification')
  }
  if (!newEmail.subject) {
    return console.log('please provide subject of the notification')
  }
  if (!newEmail.text) {
    return console.log('please provide the messageontent of the notification')
  }
  if (subject === 'Cohort Change') {
    cohortChangeMessage()
  }
  if (subject === 'New Message') {
    newPostMessage()
  }
  sgMail(newEmail)
  return console.log(`email sent to ${newEmail.to}: `, newEmail)
}

const cohortChangeMessage = () => {
  console.log('cohort changing')
}

const newPostMessage = () => {
  console.log('new post')
}
