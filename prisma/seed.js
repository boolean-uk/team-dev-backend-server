import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const cohort = await createCohort()

  const student = await createUser(
    'student@test.com', // email
    'Testpassword1!', // password
    cohort.id, // id
    'Joe', // first
    'Bloggs', // last
    'Hello, world!', // bio
    'student1', // url
    '123', // mobile
    'pro', // spec
    'boolean.co.uk', // imageUrl
    null, // jobTitle
    new Date('2024-01-01'), // startDate
    new Date('2024-06-01') // endDate
  )
  const teacher = await createUser(
    'teacher@test.com',
    'Testpassword1!',
    null,
    'Rick',
    'Sanchez',
    'Hello there!',
    'teacher1',
    '123',
    'noob',
    'boolean.co.uk',
    'Software Engineer',
    null,
    null,
    'TEACHER' // role
  )

  await createPost(student.id, 'My first post!')
  await createPost(teacher.id, 'Hello, students')

  process.exit(0)
}

async function createPost(userId, content) {
  const post = await prisma.post.create({
    data: {
      userId,
      content
    },
    include: {
      user: true
    }
  })

  console.info('Post created', post)

  return post
}

async function createCohort() {
  const cohort = await prisma.cohort.create({
    data: {}
  })

  console.info('Cohort created', cohort)

  return cohort
}

async function createUser(
  email,
  password,
  cohortId,
  firstName,
  lastName,
  bio,
  githubUsername,
  mobile,
  specialism,
  imageUrl,
  jobTitle,
  startDate,
  endDate,
  role = 'STUDENT'
) {
  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 8),
      role,
      cohortId,
      profile: {
        create: {
          firstName,
          lastName,
          bio,
          githubUsername,
          mobile,
          specialism,
          imageUrl,
          jobTitle,
          startDate,
          endDate
        }
      }
    },
    include: {
      profile: true
    }
  })

  console.info(`${role} created`, user)

  return user
}

seed().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
