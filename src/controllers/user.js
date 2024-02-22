import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/index.js'

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 409, { error: 'Email already in use' })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return sendDataResponse(res, 409, { error: 'Email already in use' })
      }
    }
    console.error('Error creating user', error)
    return sendMessageResponse(res, 500, 'Unable to create new user')
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
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const getSelf = async (req, res) => res.json({ data: req.user })

export const getAll = async (req, res) => {
  const { name } = req.query

  let foundUsers
  if (name) {
    foundUsers = await User.findManyByFirstNameOrLastName(name)
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
  const { cohort_id: cohortId } = req.body

  if (!cohortId) {
    return sendDataResponse(res, 400, { error: 'Cohort ID is required' })
  }

  return sendDataResponse(res, 201, { user: { cohort_id: cohortId } })
}

export const createProfile = async (req, res) => {
  const { email } = req.body

  try {
    const existingUser = await User.findByEmail(email)

    if (!existingUser) {
      return sendDataResponse(res, 404, { error: 'User not found' })
    }

    const profile = await User.createProfileDb(existingUser.id, req.body)
    return sendDataResponse(res, 201, { profile })
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable create user profile')
  }
}
