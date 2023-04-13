import { sendDataResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  return sendDataResponse(res, 201, { post: { id: 1, content } })
}

export const getAll = async (req, res) => {
  const allPostsNoAuthor = await dbClient.post.findMany({
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  })

  const author = {
    id: allPostsNoAuthor.id,
    cohortId: allPostsNoAuthor.cohortId,
    role: allPostsNoAuthor.role,
    firstName: allPostsNoAuthor.firstName,
    lastName: allPostsNoAuthor.lastName,
    bio: allPostsNoAuthor.bio,
    githubUrl: allPostsNoAuthor.githubUrl,
    profileImageUrl: allPostsNoAuthor.profileImageUrl
  }

  const formattedPosts = await dbClient.post.findMany()
  const FinalPosts = formattedPosts.forEach((post) =>
    // console.log('CL post:', post)
    Object.assign(post, { author: author })
  )

  console.log('formattedPosts as array??', formattedPosts)

  return sendDataResponse(res, 200, { posts: FinalPosts })
}
