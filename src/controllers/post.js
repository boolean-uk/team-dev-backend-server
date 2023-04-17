import { sendDataResponse } from '../utils/responses.js'
import { createPost, getAllPosts } from '../domain/post.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  const createdPost = await createPost(content, req.user.id)

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
  const allPostsNoAuthor = await getAllPosts()

  const postsWithAuthor = allPostsNoAuthor.map((post) => {
    const { id, content, createdAt, updatedAt } = post
    const { cohortId, role } = post.user
    const { firstName, lastName, bio, githubUrl, profileImageUrl } =
      post.user.profile

    return {
      id,
      content,
      createdAt,
      updatedAt,
      author: {
        id: post.user.id,
        cohortId,
        role,
        firstName,
        lastName,
        bio,
        githubUrl,
        profileImageUrl
      }
    }
  })

  return sendDataResponse(res, 200, { posts: postsWithAuthor })
}

export const updateById = async (req, res) => {
  const data = {}

  const post = await dbClient.post.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
      content: req.body.content
    },
    include: {
      user: {
        select: {
          id: true,
          role: true
        }
      }
    }
  })
  // console.log(' req.body is the content', req.body)
  // console.log(' req.params.id is the content', req.params.id)
  // console.log(' after findUnique:', post)
  // console.log(' post.userId after findUniquae:', post.userId)

  if (req.user.role === 'TEACHER' || req.user.id === post.userId) {
    // console.log('yes')
    data.post = {
      content: req.body.content,
      updatedBy: req.user.id
    }
  } else {
    return sendDataResponse(res, 403, {
      authorization:
        'You must be the original poster or a teacher to edit this post'
    })
  }

  return sendDataResponse(res, 200, { post: data.post })
}
