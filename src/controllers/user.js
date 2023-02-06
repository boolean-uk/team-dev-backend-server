import User from '../domain/user.js'
import { Cohort } from '../domain/cohort.js'
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
  const id = Number(req.params.id)
  const { cohortId } = req.body

  try {
    if (req.user.role === 'STUDENT') {
      if (req.body.cohortId || req.body.role) {
        return sendDataResponse(res, 403, {
          error: 'A student cannot update cohortId or role'
        })
      }
    }

    const foundCohort = await Cohort.findById(cohortId)

    if (!foundCohort) {
      return sendDataResponse(res, 404, { id: 'This cohort does not exist' })
    }

    const userToUpdate = await User.findById(id)
    if (!userToUpdate) {
      return sendDataResponse(res, 404, { error: 'This user does not exist' })
    }

    const userInstance = await User.fromJson(req.body)
    userInstance.id = userToUpdate.id

    const updatedUser = await userInstance.updateById()

    sendDataResponse(res, 201, { user: { ...updatedUser } })
  } catch (error) {
    console.error(error)
    return sendDataResponse(res, 500, {
      error: 'Unable to update user, please try again'
    })
  }
}
