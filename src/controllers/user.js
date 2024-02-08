import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 409, { email: 'Email already in use' })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    console.error('Error creating user', error)
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

  let foundUsers = []
  if (name) {
    const nameParts = name.split(' ')
    const promise = Promise.all(
      nameParts.map(async (word) => {
        return User.findManyByFirstNameOrLastName(word)
      })
    )

    let results = await promise
    results = results.flat()

    results.forEach((user) => {
      const { id } = user
      const match = foundUsers.some((entry) => entry.id === id)
      if (!match) {
        user.count = 1
        foundUsers.push(user)
      } else {
        const dupeResult = foundUsers.find((entry) => entry.id === id)
        dupeResult.count++
      }
    })
    foundUsers.sort((a, b) => b.count - a.count)
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
    return sendDataResponse(res, 400, { cohort_id: 'Cohort ID is required' })
  }

  return sendDataResponse(res, 201, { user: { cohort_id: cohortId } })
}
