import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const department1 = await createDepartment('Software Development')
  const department2 = await createDepartment('Data Analytics')
  const cohort1 = await createCohort('Cohort 1', department1)
  const cohort2 = await createCohort('Cohort 2', department2)
  await createCohort('Cohort 3', department1)

  const student1 = await createUserWithRole(
    'student@test.com',
    'Testpassword1!',
    'STUDENT',
    cohort1.id,
    'Joe',
    'Bloggs',
    'Hello, world!',
    'https://github.com/student1'
  )
  await createUserWithRole(
    'student2@test.com',
    'Testpassword1!',
    'STUDENT',
    cohort2.id,
    'Lee',
    'Dev',
    'Hello, world!',
    'https://github.com/student1'
  )
  // Creating teacher users with specific departments
  const teacher1 = await createUserWithRole(
    'teacher@test.com',
    'Testpassword1!',
    'TEACHER',
    null,
    'Rick',
    'Sanchez',
    'Wubba Lubba Dub Dub!',
    'https://github.com/rick',
    department1
  )
  await createUserWithRole(
    'teacher2@test.com',
    'Testpassword1!',
    'TEACHER',
    null,
    'Max',
    'Sminth',
    'Hello there',
    'https://github.com/max',
    department2
  )
  await createPost(
    student1.id,
    'My first post!',
    [
      { content: 'hi', userId: 2 },
      { content: "'sup?", userId: 2 }
    ],
    [{ userId: 2 }]
  )
  await createPost(teacher1.id, 'Hello, students', [], [{ userId: 1 }])

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

async function createDepartment(name) {
  const department = await prisma.department.create({
    data: {
      name
    }
  })
  console.info('Department created', department)
  return department
}

async function createCohort(name, department) {
  const cohort = await prisma.cohort.create({
    data: {
      name,
      department: {
        connect: {
          id: department.id
        }
      }
    },
    include: {
      users: true,
      department: true
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
  department
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
        user: {
          connect: {
            id: user.id
          }
        },
        department: {
          connect: {
            id: department.id
          }
        }
      },
      include: {
        department: {
          select: {
            name: true
          }
        }
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
