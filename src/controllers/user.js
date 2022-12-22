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
  const { firstName } = req.query

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

export const updateCohortById = async (req, res) => {
  const { cohortId } = req.body
  const userId = Number(req.params.id)

  if (!cohortId) {
    return sendDataResponse(res, 400, { cohortId: 'Cohort ID is required' })
  }

  try {
    const userToUpdate = await User.findById(userId)

    if (userToUpdate.cohortId === cohortId) {
      // Removes the user from the cohort if he is already in the cohort from the req body. TOGGLE Switch
      const updatedUser = await userToUpdate.removeCohort(userToUpdate)
      return sendDataResponse(res, 201, updatedUser)
    }

    if (userToUpdate.cohortId) {
      return sendMessageResponse(
        res,
        403,
        'User with that ID is already in a cohort'
      )
    }
    const updatedUser = await userToUpdate.addCohort(userToUpdate, cohortId)
    return sendDataResponse(res, 201, updatedUser)
  } catch (e) {
    console.error(e)
    if (e.code === 'P2025') {
      return sendMessageResponse(res, 400, 'Provided cohort ID not found')
    }
    return sendMessageResponse(res, 500, 'Unable to update user')
  }
}

export const updateUserById = async (req, res) => {
  const userId = Number(req.params.id)

  try {
    const userToUpdate = await User.findById(userId)
    if (!userToUpdate) {
      return sendMessageResponse(res, 404, 'Provided user ID not found')
    }
    const updatedUser = await User.updateUser(userId, req.body)
    console.log(userToUpdate)

    return sendDataResponse(res, 201, updatedUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}
