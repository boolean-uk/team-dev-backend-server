import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const cohort = await createCohort()

  const student = await createUserWithRole(
    'student@test.com',
    'Testpassword1!',
    'STUDENT',
    cohort.id,
    'Joe',
    'Bloggs',
    'Hello, world!',
    'https://github.com/student1'
  )
  console.log(cohort.id)
  // Creating teacher users with specific departments
  const teacher = await createUserWithRole(
    'rick@test.com',
    'Testpassword2!',
    'TEACHER',
    null,
    'Rick',
    'Sanchez',
    'Wubba Lubba Dub Dub!',
    'https://github.com/rick',
    'Software Developer'
  )
  await createPost(
    student.id,
    'My first post!',
    [
      { content: 'hi', userId: 2 },
      { content: "'sup?", userId: 2 }
    ],
    [{ userId: 2 }]
  )
  await createPost(teacher.id, 'Hello, students', [], [{ userId: 1 }])

  process.exit(0)
}

async function createPost(userId, content, comments, likes) {
  const post = await prisma.post.create({
    data: {
      userId,
      content,
      comments: {
        create: comments
      },
      likes: {
        create: likes
      }
    },
    include: {
      user: true,
      comments: true,
      likes: true
    }
  })

  console.info('Post created', post)

  return post
}

async function createCohort() {
  const cohort = await prisma.cohort.create({
    data: {
      name: 'Cohort 4'
    },
    include: {
      users: true
    }
  })

  console.info('Cohort created', cohort)

  return cohort
}

async function createUserWithRole(
  email,
  password,
  role,
  cohortId,
  firstName,
  lastName,
  bio,
  githubUrl,
  department = null
) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const userData = {
    email,
    password: hashedPassword,
    role,
    cohortId,
    profile: {
      create: {
        firstName,
        lastName,
        bio,
        githubUrl
      }
    }
  }

  const user = await prisma.user.create({
    data: userData,
    include: {
      profile: true
    }
  })

  if (role === 'TEACHER' && department) {
    await prisma.teacher.create({
      data: {
        userId: user.id,
        department
      }
    })
  }

  console.info(`${role} created:`, user.email)
  return user
}
seed().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
