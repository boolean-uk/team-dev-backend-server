import User from '../domain/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRY, JWT_SECRET } from '../utils/config.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const foundUser = await User.findByEmail(email)
    const areCredentialsValid = await validateCredentials(password, foundUser)

    if (!areCredentialsValid) {
      return sendDataResponse(res, 400, {
        error: ERR.EMAIL_PASS_INVALID
      })
    }

    const token = generateJwt(foundUser.id)

    return sendDataResponse(res, 200, { token, ...foundUser.toJSON() })
  } catch (e) {
    console.log('An error occured while trying to login:', e)
    return sendMessageResponse(res, 500, { error: ERR.INTERNAL_ERROR })
  }
}

function generateJwt(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

async function validateCredentials(password, user) {
  if (!user) {
    return false
  }

  if (!password) {
    return false
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    return false
  }

  return true
}
