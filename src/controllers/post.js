import { sendDataResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  const createdPost = await dbClient.post.create({
    data: {
      content: content,
      userId: req.user.id
    }
  })
  return sendDataResponse(res, 201, {
    post: {
      id: createdPost.id,
      content: createdPost.content,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
      author: { ...req.user }
    }
  })
}

export const getAll = async (req, res) => {
  let postWithAuthor
  const posts = []

  const allPostsNoAuthor = await dbClient.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          cohortId: true,
          role: true,
          profile: true
        }
      }
    }
  })

  for (let i = 0; i < allPostsNoAuthor.length; i++) {
    console.log('checking stuff---', allPostsNoAuthor[i].content)
    const post = allPostsNoAuthor[i]
    const user = post.user
    const profile = user.profile

    postWithAuthor = {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: user.id,
        cohortId: user.cohortId,
        role: user.role,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        githubUrl: profile.githubUrl,
        profileImageUrl: profile.profileImageUrl
      }
    }
    posts.push(postWithAuthor)
  }

  return sendDataResponse(res, 200, { posts: posts })
}
