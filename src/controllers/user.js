import { Prisma } from '@prisma/client'
import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
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
  // eslint-disable-next-line camelcase
  const { first_name: firstName } = req.query

  let foundUsers

  if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else {
    foundUsers = await User.findAll()
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const updateById = async (req, res) => {
  // TODO: These functions are placholders, will later be checked in the domain user.js
  function checkPassword(str) {
    const regex =
      /^(?=.*\d)(?=.*[!@#$%^&*()+_{}<>`~\\\-\/\.\,\[\]])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return regex.test(str)
  }
  function emailValidation(email) {
    const emailRegex =
      /^[0-9a-zA-Z]+(?:\.[0-9a-zA-Z]+)*@[a-zA-Z0-9]{2,}(?:\.[a-zA-Z]{2,})+$/gm
    return emailRegex.test(email)
  }

  const data = { profile: { update: {} } }

  if (req.body.email) {
    if (emailValidation(req.body.email)) {
      data.email = req.body.email
    } else {
      return sendMessageResponse(res, 400, 'Invalid Email')
    }
  }

  if (req.body.password) {
    if (checkPassword(req.body.password)) {
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
    return sendDataResponse(res, 201, { User: updatedUser })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return sendMessageResponse(res, 500, 'Invalid cohortId')
      }
      if (e.code === 'P2002') {
        return sendMessageResponse(res, 400, 'Email is already in use')
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
