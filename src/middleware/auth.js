import { Prisma } from '@prisma/client'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { JWT_SECRET } from '../utils/config.js'
import jwt from 'jsonwebtoken'
import User from '../domain/user.js'
import { findById } from '../domain/post.js'

import { getCommentById } from '../domain/comment.js'
export async function validateTeacherRole(req, res, next) {
  if (!req.user) {
    return sendMessageResponse(res, 500, 'Unable to verify user')
  }

  if (req.user.role !== 'TEACHER') {
    return sendDataResponse(res, 403, {
      authorization: 'You are not authorized to perform this action'
    })
  }

  next()
}

export async function validateIdOrRole(req, res, next) {
  if (!req.user) {
    return sendMessageResponse(res, 401, 'Unable to verify user')
  }

  if (req.user.id === Number(req.params.id) || req.user.role === 'TEACHER') {
    next()
  } else {
    return sendDataResponse(res, 403, {
      authorization: 'You are not authorized to perform this action'
    })
  }
}

export async function validateAuthentication(req, res, next) {
  const header = req.header('authorization')

  if (!header) {
    return sendDataResponse(res, 401, {
      authorization: 'Missing Authorization header'
    })
  }

  const [type, token] = header.split(' ')

  const isTypeValid = validateTokenType(type)
  if (!isTypeValid) {
    return sendDataResponse(res, 401, {
      authentication: `Invalid token type, expected Bearer but got ${type}`
    })
  }

  const isTokenValid = validateToken(token)
  if (!isTokenValid) {
    return sendDataResponse(res, 401, {
      authentication: 'Invalid or missing access token'
    })
  }

  const decodedToken = jwt.decode(token)
  const foundUser = await User.findById(decodedToken.userId)
  delete foundUser.passwordHash

  req.user = foundUser

  next()
}

function validateToken(token) {
  if (!token) {
    return false
  }

  return jwt.verify(token, JWT_SECRET, (error) => {
    return !error
  })
}

function validateTokenType(type) {
  if (!type) {
    return false
  }

  if (type.toUpperCase() !== 'BEARER') {
    return false
  }

  return true
}

export async function validateEditPostAuth(req, res, next) {
  if (!req.user) {
    return sendMessageResponse(res, 401, 'Unable to verify user')
  }

  try {
    const post = await findById(Number(req.params.id))
    if (req.user.id === post.user.id || req.user.role === 'TEACHER') {
      req.post = post
    } else {
      return sendDataResponse(res, 403, {
        authorization: 'You are not authorized to perform this action'
      })
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        console.error(e)
        return sendDataResponse(res, 404, { error: 'Post not found' })
      }
    }
  }

  next()
}

export async function validateEditCommentAuth(req, res, next) {
  if (!req.user) {
    return sendMessageResponse(res, 401, 'Unable to verify user')
  }

  try {
    const comment = await getCommentById(Number(req.params.commentid))

    if (req.user.id !== comment.userId) {
      return sendDataResponse(res, 403, {
        authorization: 'You are not authorized to perform this action'
      })
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        console.error(e)
        return sendDataResponse(res, 404, { error: 'Comment not found' })
      }
    }
  }

  next()
}
