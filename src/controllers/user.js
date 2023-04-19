import { Prisma } from '@prisma/client'
import User from '../domain/user.js'
import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { firstName, lastName, email, bio, githubUrl, password } = req.body

  if (!User.emailValidation(email)) {
    return sendDataResponse(res, 400, { error: 'Email format invalid' })
  }
  if (!password) {
    return sendDataResponse(res, 400, { error: 'Password is required' })
  }
  if (!User.passwordValidation(password)) {
    return sendDataResponse(res, 400, {
      error:
        'Password must contain at least one upper case character, at least one number, at least one special character and not be less than 8 characters in length.'
    })
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
      return sendDataResponse(res, 400, { error: 'Email already in use' })
    }

    if (!userToCreate.email) {
      return sendDataResponse(res, 400, { error: 'Email is required' })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    return sendDataResponse(res, 500, { error: 'Unable to create new user' })
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { error: 'User not found' })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'Unable to get user' })
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
    const users = await User.findByName(name).then((users) =>
      mapOutUsers(users)
    )

    return sendDataResponse(res, 200, { users })
  } else {
    const users = await User.findAll().then((users) => mapOutUsers(users))

    return sendDataResponse(res, 200, { users })
  }
}

export const updateById = async (req, res) => {
  const data = {}

  if (req.body.email) {
    if (User.emailValidation(req.body.email)) {
      data.email = req.body.email
    } else {
      return sendDataResponse(res, 400, { error: 'Invalid Email' })
    }
  }
  if (req.body.password) {
    if (User.checkPassword(req.body.password)) {
      data.password = req.body.password
    } else {
      return sendDataResponse(res, 400, { error: 'Invalid Password' })
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

  if (
    req.body.firstName ||
    req.body.lastName ||
    req.body.bio ||
    req.body.githubUrl
  ) {
    data.profile = { update: {} }
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
    delete updatedUser.password
    return sendDataResponse(res, 201, { user: updatedUser })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2016') {
        return sendDataResponse(
          res,
          400,
          'Please create a Profile before updating it.'
        )
      }
      if (e.code === 'P2025') {
        return sendDataResponse(res, 404, { error: 'Invalid cohortId' })
      }
      if (e.code === 'P2002') {
        return sendDataResponse(res, 409, { error: 'Email is already in use' })
      }
    }
    if (e instanceof Prisma.PrismaClientValidationError) {
      return sendDataResponse(res, 400, {
        error: 'Invalid Role. Valid roles are: STUDENT, TEACHER'
      })
    }
  }
}

export const getByRole = async (req, res) => {
  try {
    const foundTeachers = await User.findAllTeachers()

    if (foundTeachers.length === 0) {
      return sendDataResponse(res, 404, 'No teachers found')
    }

    return sendDataResponse(res, 200, { users: foundTeachers })
  } catch (e) {
    return sendDataResponse(res, 500, 'Unable to get all teachers')
  }
}
