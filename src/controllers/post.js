import { getAllPostsDb, getPostByIdDb } from '../domain/post.js'
import { sendDataResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: ERR.MISSING_CONTENT })
  }

  return sendDataResponse(res, 201, { post: { id: 1, content } })
}

export const getAll = async (req, res) => {
  const getPosts = await getAllPostsDb()
  const posts = getPosts.map((post) => {
    const { user } = post
    if (!user.profile) {
      return post
    }
    return {
      id: post.id,
      content: post.content,
      author: {
        id: user.profile.id,
        cohortId: user.cohortId,
        role: user.role,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        bio: user.profile.bio,
        githubUrl: user.profile.githubUrl
      }
    }
  })
  return sendDataResponse(res, 200, { posts: posts })
}

export const getPostByID = async (req, res) => {
  const postId = Number(req.params.id)

  const found = await getPostByIdDb(postId)

  if (!found) {
    return sendDataResponse(res, 401, { error: ERR.POST_NOT_FOUND })
  }
  const { id, content } = found

  return sendDataResponse(res, 200, { post: { id, content } })
}
