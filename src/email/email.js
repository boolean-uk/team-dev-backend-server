import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const recipient = ''
const subject = ''
const message = ''
const hmtlInsert = ''

const newEmail = {
  to: `${recipient}`,
  from: 'cohort10.boolean@gmail.com',
  subject: `${subject}`,
  text: `${message}`,
  html: `${hmtlInsert}`
}

sgMail
  .send(newEmail)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
