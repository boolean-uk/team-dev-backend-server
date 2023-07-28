import dbClient from '../utils/dbClient.js'

export async function findPost(postId) {
  return await dbClient.post.findUnique({
    where: {
      id: postId
    },
    include: {
      user: true
    }
  })
}

export async function findPostWithComments(postId) {
  return await dbClient.post.findUnique({
    where: {
      id: postId
    },
    include: {
      user: true,
      comments: true
    }
  })
}

export async function clearComments(postId) {
  return await dbClient.comment.deleteMany({
    where: {
      postId: postId
    }
  })
}

export async function deletePost(postId) {
  return await dbClient.post.delete({
    where: {
      id: postId
    }
  })
}
