import { Prisma } from '@prisma/client'
import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  if (!User.emailValidation(req.body.email)) {
    return sendMessageResponse(res, 400, 'Email format invalid')
  }
  if (!req.body.password) {
    return sendMessageResponse(res, 400, 'Password is required')
  }
  if (!User.passwordValidation(req.body.password)) {
    return sendMessageResponse(
      res,
      400,
      'Password must contain at least one upper case character, at least one number, at least one special character and not be less than 8 characters in length.'
    )
  }
  if (
    (req.body.bio || req.body.githubUrl) &&
    (!req.body.firstName || !req.body.lastName)
  ) {
    return sendMessageResponse(
      res,
      409,
      'Must include first name and last name if providing bio or github details'
    )
  }

  const userToCreate = await User.fromJson(req.body)

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

  let firstName = ''
  let lastName = ''

  if (name) {
    const nameSplitIntoArray = name.split(' ')

    if (nameSplitIntoArray[0].length > 0) {
      firstName = nameSplitIntoArray[0]
    }
    if (nameSplitIntoArray.length > 1) {
      if (nameSplitIntoArray[1].length > 0) {
        lastName = nameSplitIntoArray[1]
      }
    }
  }

  let numberOfNamesGiven = 0

  const mapOutUsers = (users) => {
    return users.map((item) => {
      return {
        ...item.toJSON().user
      }
    })
  }

  if (!name) {
    const users = await User.findAll().then((users) => mapOutUsers(users))
    return sendDataResponse(res, 200, { users })
  }

  const where = {
    profile: {}
  }

  if (firstName) {
    numberOfNamesGiven++
    where.profile.firstName = {
      contains: firstName,
      mode: 'insensitive'
    }
  }

  if (lastName) {
    numberOfNamesGiven++
    where.profile.lastName = {
      contains: lastName,
      mode: 'insensitive'
    }
  }

  if (numberOfNamesGiven !== 1) {
    const _where = {
      AND: where
    }

    const users = await User.findByName(_where).then((users) =>
      mapOutUsers(users)
    )

    return sendDataResponse(res, 200, { users })
  } else if (numberOfNamesGiven === 1) {
    const users = await User.findByName(where).then((users) =>
      mapOutUsers(users)
    )

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
