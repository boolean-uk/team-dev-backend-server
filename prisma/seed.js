import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const cohort = await createCohort()

  const student = await createUser(
    'student@test.com',
    'Testpassword1!',
    cohort.id,
    'Joe',
    'Bloggs',
    'Hello, world!',
    'student1'
  )
  const teacher = await createUser(
    'teacher@test.com',
    'Testpassword1!',
    null,
    'Rick',
    'Sanchez',
    'Hello there!',
    'teacher1',
    'TEACHER'
  )

  await createPost(student.id, 'My first post!')
  await createPost(teacher.id, 'Hello, students')

  await createComment(student.id, 1, 'Student Comment on Student Post')
  await createComment(student.id, 2, 'Student Comment on Teacher Post')
  await createComment(teacher.id, 1, 'Teacher Comment on Student Post')
  await createComment(teacher.id, 2, 'Teacher Comment on Teacher Post')

  await createCourse('Software Development', 1)
  await createModule('Programming Fundamentals', 'Software Development')
  await createUnit('Arrays', 'Programming Fundamentals')
  await createVideo(
    'Arrays part 1',
    'http://www.booleanvideos.com/arrayspt1',
    120,
    'Arrays'
  )

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

async function createComment(userId, postId, content) {
  const comment = await prisma.comment.create({
    data: {
      userId,
      postId,
      content
    },
    include: {
      post: true
    }
  })

  console.info('Comment Created', comment)

  return comment
}

async function createCohort() {
  const cohort = await prisma.cohort.create({
    data: {}
  })

  console.info('Cohort created', cohort)

  return cohort
}

async function createCourse(courseName, cohortId) {
  const course = await prisma.course.create({
    data: {
      name: courseName,
      cohorts: {
        connect: {
          id: cohortId
        }
      }
    },
    include: {
      cohorts: true
    }
  })
  console.info('Course created', course)
  return course
}

async function createModule(moduleName, courseName) {
  const module = await prisma.module.create({
    data: {
      name: moduleName,
      courses: {
        connect: {
          name: courseName
        }
      }
    },
    include: {
      courses: true
    }
  })
  console.info('Module created', module)
  return module
}

async function createUnit(unitName, moduleName) {
  const unit = await prisma.unit.create({
    data: {
      name: unitName,
      module: {
        connect: {
          name: moduleName
        }
      }
    },
    include: {
      module: true
    }
  })
  console.info('Unit created', unit)
  return unit
}

async function createVideo(videoName, url, videoLength, unitName) {
  const video = await prisma.video.create({
    data: {
      name: videoName,
      url,
      videoLength,
      unit: {
        connect: {
          name: unitName
        }
      }
    },
    include: {
      unit: true
    }
  })
  console.info('Video created', video)
  return video
}

async function createUser(
  email,
  password,
  cohortId,
  firstName,
  lastName,
  bio,
  githubUrl,
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
          githubUrl
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
