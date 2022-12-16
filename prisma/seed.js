// import { PrismaClient } from '@prisma/client'
import dbClient from '../src/utils/dbClient.js'

// const prisma = new PrismaClient()

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

  console.log(nathanTeacher)

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

  console.log(nathanStudent)


  //   const alicePost = await dbClient.post.create({
  //     data: {
  //       title: 'Why Python sucks',
  //       content: 'Because I dont understand it...',
  //       imageUrl: 'https://picsum.photos/200',
  //       publishedAt: new Date(Date.now()),
  //       comments: {
  //         create: {
  //           content: 'Python > JavaScript all day!',
  //           user: { connect: { id: bob.id } }
  //         }
  //       },
  //       categories: {
  //         create: [{ name: 'Python' }, { name: 'JavaScript' }, { name: 'Coding' }]
  //       },
  //       user: { connect: { id: alice.id } }
  //     }
  //   })
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
