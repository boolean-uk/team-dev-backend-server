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
    const includeNotes = req.user.role === 'TEACHER'
    const foundUser = await User.findById(id, includeNotes)
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
  const { first_name: firstName, last_name: lastName } = req.query

  let foundUsers

  if (firstName || lastName) {
    foundUsers = await User.findManyByName(firstName, lastName)
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

const validateUpdateByIDRequest = (req) => {
  const keys = Object.keys(req.body)
  const validKeys = keys.find((key) => {
    return key !== 'role' && key !== 'email' && key !== 'cohortId'
  })
  if (validKeys) {
    return { Error: 'Invalid key provided!' }
  }
  if (keys.includes('role') && typeof req.body.role !== 'string') {
    return { Error: 'Role must be a string!' }
  }
  if (keys.includes('email') && typeof req.body.email !== 'string') {
    return { Error: 'Email must be a string!' }
  }
  if (keys.includes('cohortId') && typeof req.body.cohortId !== 'number') {
    return { Error: 'CohortId must be a number!' }
  }
  return null
}

export const updateById = async (req, res) => {
  const validationError = validateUpdateByIDRequest(req, res)
  if (validationError) {
    return sendDataResponse(res, 400, validationError)
  }
  if (req.user.role !== 'TEACHER') {
    return sendDataResponse(res, 403, { Error: 'Permission denied!' })
  }
  try {
    await User.updateUserDetails(req)
    return sendDataResponse(res, 200, { user: req.body })
  } catch (error) {
    return sendDataResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}
