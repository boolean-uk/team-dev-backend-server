import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient();

async function seed() {
    const cohort = await createCohort()

    const student = await createUser('student@test.com', 'Testpassword1!', cohort.id, 'Joe', 'Bloggs', 'Hello, world!', 'student1')
    const teacher = await createUser('teacher@test.com', 'Testpassword1!', null, 'Rick', 'Sanchez', 'Hello there!', 'teacher1', 'TEACHER')

    const post1 = await createPost(student.id, 'My first post!')
    const post2 = await createPost(teacher.id, 'Hello, students')
    const comment1 = await createComment(teacher.id, post1.id, 'congrats on the first post')
    const comment2 = await createComment(student.id, post2.id, 'hello teacher')
    await createLikeOnPost(student.id, post1.id)
    await createLikeOnComment(student.id, comment1.id)
    await createLikeOnComment(teacher.id, comment2.id)
    process.exit(0);
}

async function createLikeOnPost(userId, postId) {
    const like = await prisma.like.create({
        data: {
            userId: userId,
            postId: postId
        }
    })

    console.info('post like created', like)

    return like
}

async function createLikeOnComment(userId, commentId) {
    const like = await prisma.like.create({
        data: {
            userId: userId,
            commentId: commentId
        }
    })

    console.info('comment like created', like)
    
    return like
}

async function createComment(userId, postId, content) {
    const comment = await prisma.comment.create({
        data: {
            userId: userId,
            postId: postId,
            content: content
        }
    })

    console.info('comment created', comment)

    return comment
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

async function createUser(email, password, cohortId, firstName, lastName, bio, githubUrl, role = 'STUDENT') {
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

seed()
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1)
    })