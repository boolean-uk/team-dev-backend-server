import User from '../domain/user.js'
import dbClient from '../utils/dbClient.js'
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

export const updateById = async (req, res) => {
  const entries = Object.entries(req.body)
  const id = Number(req.params.id)
  const body = req.body
  if (!entries[0]) {
    return sendDataResponse(res, 400, {
      Error: 'No / incorrect data has been provided.'
    })
  }
  if (req.user.role === 'TEACHER') {
    User.updateUserDetails(entries, id)
    return sendDataResponse(res, 201, { user: body })
  } else {
    return sendDataResponse(res, 400, {
      Error: 'User not authorised for this action.'
    })
  }
}
