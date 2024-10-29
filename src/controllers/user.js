import User from '../domain/user.js'
import bcrypt from 'bcrypt'
import { validateTeacherRole } from '../middleware/auth.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

/**
 * Updates a user by ID
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendMessageResponse(res, 400, 'Email already in use')
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new user')
  }
}

/**
 * Updates a user by ID
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendMessageResponse(res, 404, 'User not found')
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const getAll = async (req, res) => {
  const { name } = req.query

  let foundUsers

  if (name) {
    foundUsers = await User.findByName(name)
  } else {
    foundUsers = await User.findAll()
  }

  if (!foundUsers || foundUsers.length === 0) {
    return sendMessageResponse(res, 404, 'User not found')
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

/**
 * Updates a user by ID
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export const updateById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id)

    if (!userId) {
      return sendMessageResponse(res, 400, 'Invalid user ID')
    }

    const existingUser = await User.findById(userId)
    if (!existingUser) {
      return sendMessageResponse(res, 404, 'User not found')
    }

    const updates = req.body
    const updateUnchecked = async () => {
      if (updates.password) {
        existingUser.passwordHash = await bcrypt.hash(updates.password, 8)
      }

      ;[
        'firstName',
        'lastName',
        'email',
        'bio',
        'githubUsername',
        'mobile',
        'specialism',
        'imageUrl',
        'startDate',
        'endDate',
        'role'
      ].forEach((field) => {
        if (updates[field] !== undefined) {
          existingUser[field] = updates[field]
        }
      })

      const updatedUser = await existingUser.update()
      return sendDataResponse(res, 201, updatedUser.toJSON())
    }

    if (updates.cohort_id || updates.role) {
      // If user attempts to update privileged fields, validate theyre a teacher before updating
      return validateTeacherRole(req, res, updateUnchecked)
    } else {
      updateUnchecked()
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return sendMessageResponse(res, 500, 'Internal server error')
  }
}

/**
 * Updates a user by ID
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export const deleteById = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const deleted = await User.deleteById(id)

    return sendDataResponse(res, 200, deleted.toJSON())
  } catch (error) {
    console.error('Error deleting user:', error)
    return sendMessageResponse(res, 404, 'User not found')
  }
}
