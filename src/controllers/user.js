import User from '../domain/user.js'
import dbClient from '../utils/dbClient.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { validateCanModify } from '../utils/validationFunctions.js'
import * as validation from '../utils/validationFunctions.js'
import ERR from '../utils/errors.js'

export const create = async (req, res) => {
  try {
    validation.register(req.body.email, req.body.password)
  } catch (e) {
    return sendDataResponse(res, 400, { error: e.message })
  }

  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { error: ERR.EMAIL_IN_USE })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    console.error(ERR.UNABLE_TO_CREATE_USER, error)
    return sendMessageResponse(res, 500, ERR.UNABLE_TO_CREATE_USER)
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { error: ERR.USER_NOT_FOUND })
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
  const paramsId = Number(req.params.id)
  const { id } = req.user
  const foundUser = await User.findById(paramsId)

  if (!foundUser) {
    return sendDataResponse(res, 404, { error: ERR.USER_NOT_FOUND })
  }
  const canPatch = validation.validateCanModify(req)
  if (!canPatch) {
    return sendDataResponse(res, 403, { error: ERR.NOT_AUTHORISED })
  }
  const updatedUser = await User.updateUser(id, req.body)

  delete updatedUser.password

  return sendDataResponse(res, 200, { user: updatedUser })
}

export const deleteUserById = async (req, res) => {
  const id = Number(req.params.id)
  const canDelete = validateCanModify(req)

  if (isNaN(id)) {
    return sendDataResponse(res, 400, { error: ERR.BAD_REQUEST })
  }

  if (!canDelete) {
    return sendDataResponse(res, 401, { error: ERR.NOT_AUTHORISED })
  }

  try {
    const userToDelete = await User.findById(id)

    if (!userToDelete) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    await dbClient.post.deleteMany({
      where: { userId: id }
    })
    await dbClient.profile.delete({
      where: { userId: id }
    })

    await User.deleteUserByIdDb(userToDelete.id)
    return sendDataResponse(res, 200, { deleted_user: userToDelete })
  } catch (error) {
    console.error(
      'An error occured while proccessing this delete request',
      error
    )
    return sendDataResponse(res, 500, { error: ERR.DELETE_GENERIC_ERROR })
  }
}
