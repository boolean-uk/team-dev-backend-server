import dbClient from '../utils/dbClient.js'

export async function getCommentsDb() {
  const comments = await dbClient.comment.findMany({
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  })

  const newCommentList = comments.map((comment) => {
    const profile = comment.user.profile

    const author = {
      firstName: profile.firstName,
      lastName: profile.lastName
    }

    return {
      id: comment.id,
      content: comment.content,
      postId: comment.post.id,
      userId: comment.user.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author
    }
  })
  return newCommentList
}
