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

export async function editExistingPost(content, postId) {
  return await dbClient.post.update({
    data: {
      content: content
    },
    where: {
      id: postId
    }
  })
}

export async function deleteExistingPost(postId) {
  return await dbClient.post.delete({
    where: {
      id: postId
    }
  })
}

export async function createPost(content, userId) {
  return await dbClient.post.create({
    data: {
      content: content,
      userId: userId
    },
    select: {
      id: true,
      content: true
    }
  })
}
