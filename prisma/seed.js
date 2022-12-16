import dbClient from '../src/utils/dbClient.js'

async function main() {
  const nathanTeacher = await dbClient.user.upsert({
    where: { email: 'ngk5@gmail.com' },
    update: {},
    create: {
      email: 'ngk5@gmail.com',
      password: 'mysecurepassword',
      role: 'TEACHER',
      profile: {
        create: {
          firstName: 'Nathan',
          lastName: 'King',
          bio: 'Hello world',
          githubUrl: 'https://github.com/vherus'
        }
      }
    },
    include: {
      profile: true,
      posts: true
    }
  })

  const nathanStudent = await dbClient.user.upsert({
    where: { email: 'ngk10@gmail.co' },
    update: {},
    create: {
      email: 'ngk10@gmail.co',
      password: 'mysecurepassword',
      profile: {
        create: {
          firstName: 'Nathan',
          lastName: 'King',
          bio: 'Hello world',
          githubUrl: 'https://github.com/vherus'
        }
      }
    },
    include: {
      profile: true,
      posts: true
    }
  })

  const nathanStudentPosts = await dbClient.post.createMany({
    data: [
      { userId: nathanStudent.id, content: 'Students first post!' },
      { userId: nathanStudent.id, content: 'Students second post!' },
      { userId: nathanStudent.id, content: 'Students third post!' }
    ]
  })

  const nathanTeacherPosts = await dbClient.post.createMany({
    data: [
      { userId: nathanTeacher.id, content: 'Teachers first post!' },
      { userId: nathanTeacher.id, content: 'Teachers second post!' },
      { userId: nathanTeacher.id, content: 'Teachers third post!' }
    ]
  })

  const nathanStudentComment = await dbClient.comment.create({
    data: {
      content: 'Students first comment!',
      user: {
        connect: { id: nathanStudent.id }
      },
      post: {
        connect: { id: 4 }
      }
    }
  })

  const nathanTeacherComment = await dbClient.comment.create({
    data: {
      content: 'Teachers first comment!',
      user: {
        connect: { id: nathanTeacher.id }
      },
      post: {
        connect: { id: 1 }
      }
    }
  })

  const nathanTeacherCommentOnComment = await dbClient.comment.create({
    data: {
      content: 'Teachers first comment on a comment!',
      user: {
        connect: { id: nathanTeacher.id }
      },
      post: {
        connect: { id: 1 }
      },
      child: {
        connect: { id: 1 }
      }
    }
  })

  const createCohorts = await dbClient.cohort.createMany({
    data: [{}, {}]
  })

  const connectStudentToCohort1 = await dbClient.user.update({
    where: { id: nathanStudent.id },
    data: {
      cohort: {
        connect: { id: 1 }
      }
    }
  })

  const connectTeacherToCohort1 = await dbClient.user.update({
    where: { id: nathanTeacher.id },
    data: {
      cohort: {
        connect: { id: 1 }
      }
    }
  })

  const deliveryLogForCohort1 = await dbClient.deliveryLog.create({
    data: {
      cohort: {
        connect: { id: 1 }
      },
      user: {
        connect: { id: nathanTeacher.id }
      }
    }
  })

  const createDeliveryLogLine = await dbClient.deliveryLogLine.create({
    data: {
      content: 'My delivery log line',
      log: {
        connect: { id: deliveryLogForCohort1.id }
      }
    }
  })
}
main()
  .then(async () => {
    await dbClient.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await dbClient.$disconnect()
    process.exit(1)
  })
