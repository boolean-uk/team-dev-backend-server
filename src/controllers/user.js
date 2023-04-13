import { Prisma } from '@prisma/client'
import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { firstName, lastName, email, bio, githubUrl, password } = req.body

  if (!User.emailValidation(email)) {
    return sendMessageResponse(res, 400, 'Email format invalid')
  }
  if (!password) {
    return sendMessageResponse(res, 400, 'Password is required')
  }
  if (!User.passwordValidation(password)) {
    return sendMessageResponse(
      res,
      400,
      'Password must contain at least one upper case character, at least one number, at least one special character and not be less than 8 characters in length.'
    )
  }

  const userToCreate = await User.fromJson({
    firstName,
    lastName,
    email,
    bio,
    githubUrl,
    password
  })

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    if (!userToCreate.email) {
      return sendMessageResponse(res, 400, 'Email is required')
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new user')
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const getAll = async (req, res) => {
  const { name } = req.query

  const mapOutUsers = (users) => {
    return users.map((item) => {
      return {
        ...item.toJSON().user
      }
    })
  }

  if (name) {
    const where = {
      profile: {}
    }

    const [firstName, ...rest] = name.split(' ')
    const lastName = rest.join(' ')
    const amountOfNames = name.split(' ').length

    if (amountOfNames === 1) {
      where.profile = {
        OR: [
          {
            firstName: {
              contains: name,
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: name,
              mode: 'insensitive'
            }
          }
        ]
      }
    } else if (amountOfNames > 1) {
      where.profile = {
        AND: [
          {
            firstName: {
              contains: firstName,
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: lastName,
              mode: 'insensitive'
            }
          }
        ]
      }
    }

    const users = await User.findByName(where).then((users) =>
      mapOutUsers(users)
    )

    return sendDataResponse(res, 200, { users })
  } else {
    const users = await User.findAll().then((users) => mapOutUsers(users))

    return sendDataResponse(res, 200, { users })
  }
}

export const updateById = async (req, res) => {
  const data = { profile: { update: {} } }

  if (req.body.email) {
    if (User.emailValidation(req.body.email)) {
      data.email = req.body.email
    } else {
      return sendMessageResponse(res, 400, 'Invalid Email')
    }
  }

  if (req.body.password) {
    if (User.checkPassword(req.body.password)) {
      data.password = req.body.password
    } else {
      return sendMessageResponse(res, 400, 'Invalid Password')
    }
  }

  if (req.body.cohortId && req.user.role === 'TEACHER') {
    if (req.user.role === 'TEACHER') {
      data.cohort = {
        connect: {
          id: req.body.cohortId
        }
      }
    } else {
      return sendDataResponse(res, 403, {
        authorization: 'Only TEACHERS are allowed to update cohortId'
      })
    }
  }

  if (req.body.role) {
    if (req.user.role === 'TEACHER') {
      data.role = req.body.role
    } else {
      return sendDataResponse(res, 403, {
        authorization: 'Only TEACHERS are allowed to update roles'
      })
    }
  }

  if (req.body.firstName) {
    data.profile.update.firstName = req.body.firstName
  }

  if (req.body.lastName) {
    data.profile.update.lastName = req.body.lastName
  }

  if (req.body.bio) {
    data.profile.update.bio = req.body.bio
  }
  if (req.body.githubUrl) {
    data.profile.update.githubUrl = req.body.githubUrl
  }

  try {
    const updatedUser = await User.updateById(Number(req.params.id), data)
    return sendDataResponse(res, 201, { user: updatedUser })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return sendMessageResponse(res, 404, 'Invalid cohortId')
      }
      if (e.code === 'P2002') {
        return sendMessageResponse(res, 409, 'Email is already in use')
      }
    }
    if (e instanceof Prisma.PrismaClientValidationError) {
      return sendMessageResponse(
        res,
        400,
        'Invalid Role. Valid roles are: STUDENT, TEACHER'
      )
    }
  }
}
