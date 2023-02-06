import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  // Check for the Required fields
  if (!req.body.email || req.body.email === '') {
    return sendDataResponse(res, 400, { error: 'Email is required' })
  }
  if (!req.body.password || req.body.password === '') {
    return sendDataResponse(res, 400, { error: 'Password is required' })
  }

  const userToCreate = await User.fromJson(req.body)
  try {
    // User exists
    const existingUser = await User.findByEmail(userToCreate.email)
    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    // Typeof in the req.body
    const foundNotString = Object.values(req.body).find(
      (field) => typeof field !== 'string'
    )
    if (foundNotString) {
      return sendDataResponse(res, 400, 'one or more fields is invalid')
    }
    // Checking the validation of the email
    const isValidEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
      req.body.email
    )
    if (!isValidEmail) {
      return sendDataResponse(res, 400, { error: 'Email format invalid' })
    }

    const isValidPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        req.body.password
      )
    if (!isValidPassword) {
      return sendDataResponse(res, 400, {
        error:
          'Password must contain at least one upper case character, at least one number, at least one special character and not be less than 8 characters in length.'
      })
    }

    // If optionals present: error if not first or last name
    let hasOptional = false
    Object.keys(req.body).forEach((key) => {
      if (
        key === 'firstName' ||
        key === 'lastName' ||
        key === 'githubUrl' ||
        key === 'biography'
      ) {
        hasOptional = true
      }
    })
    if (hasOptional && (!req.body.firstName || !req.body.lastName)) {
      return sendDataResponse(res, 400, {
        error: 'Missing first name or last name'
      })
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
  // anyone updating getAll : feel free to clean/refactor this or just add all your code and we (team-1) will be happy to clean it up once all needed queries are added
  const { first_name: firstName, last_name: lastName } = req.query
  let foundUsers

  if (!firstName && !lastName) {
    return sendDataResponse(res, 400, {
      error: 'Missing value from query parameter'
    })
  }

  if (firstName && lastName) {
    foundUsers = await User.findManyByFullName(firstName, lastName)
  } else if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else if (lastName) {
    foundUsers = await User.findManyByLastName(lastName)
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
