import dbClient from '../utils/dbClient.js'
import bcrypt from 'bcrypt'

export default class User {
  /**
   * This is JSDoc - a way for us to tell other developers what types functions/methods
   * take as inputs, what types they return, and other useful information that JS doesn't have built in
   * @tutorial https://www.valentinog.com/blog/jsdoc
   *
   * @param { { id: int, cohortId: int, email: string, profile: { firstName: string, lastName: string, bio: string, githubUsername: string } } } user
   * @returns {User}
   */
  static fromDb(user) {
    return new User(
      user.id,
      user.cohortId,
      user.profile?.firstName,
      user.profile?.lastName,
      user.email,
      user.profile?.bio,
      user.profile?.githubUsername,
      user.password,
      user.role
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const {
      firstName,
      lastName,
      email,
      biography,
      githubUsername,
      password,
      role,
      cohortId
    } = json

    const passwordHash = await bcrypt.hash(password, 8)

    return new User(
      null,
      cohortId,
      firstName,
      lastName,
      email,
      biography,
      githubUsername,
      passwordHash,
      role
    )
  }

  constructor(
    id,
    cohortId,
    firstName,
    lastName,
    email,
    bio,
    githubUsername,
    passwordHash = null,
    role
  ) {
    this.id = id
    this.cohortId = cohortId
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.bio = bio
    this.githubUsername = githubUsername
    this.passwordHash = passwordHash
    this.role = role
  }

  toJSON() {
    return {
      user: {
        id: this.id,
        cohortId: this.cohortId,
        role: this.role,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        bio: this.bio,
        githubUsername: this.githubUsername
      }
    }
  }

  /**
   * @returns {User}
   *  A user instance containing an ID, representing the user data created in the database
   */
  async save() {
    const data = {
      email: this.email,
      password: this.passwordHash,
      role: this.role
    }

    if (this.cohortId) {
      data.cohort = {
        connectOrCreate: {
          where: { id: this.cohortId },
          create: { id: this.cohortId }
        }
      }
    }

    data.profile = {
      create: {
        firstName: this.firstName,
        lastName: this.lastName,
        bio: this.bio,
        githubUsername: this.githubUsername
      }
    }

    const createdUser = await dbClient.user.create({
      data,
      include: {
        profile: true
      }
    })

    return User.fromDb(createdUser)
  }

  static async findByEmail(email) {
    return User._findByUnique('email', email)
  }

  static async findById(id) {
    return User._findByUnique('id', id)
  }

  static async findManyByFirstName(firstName) {
    return User._findMany('firstName', firstName)
  }

  static async findAll() {
    return User._findMany()
  }

  static async _findByUnique(key, value) {
    const foundUser = await dbClient.user.findUnique({
      where: {
        [key]: value
      },
      include: {
        profile: true
      }
    })

    if (foundUser) {
      return User.fromDb(foundUser)
    }

    return null
  }

  static async _findMany(key, value) {
    const query = {
      include: {
        profile: true
      }
    }

    if (key !== undefined && value !== undefined) {
      query.where = {
        profile: {
          [key]: value
        }
      }
    }

    const foundUsers = await dbClient.user.findMany(query)

    return foundUsers.map((user) => User.fromDb(user))
  }

  static async deleteUserByIdDb(id) {
    return await dbClient.user.delete({
      where: {
        id: id
      }
    })
  }

  static async updateUser(id, json) {
    const {
      email,
      password,
      firstName,
      lastName,
      bio,
      githubUsername,
      username,
      mobile,
      cohortId
    } = json
    const updatedUser = await dbClient.user.update({
      where: {
        id: id
      },
      data: {
        email: email,
        password: password,
        cohortId,
        profile: {
          update: {
            firstName: firstName,
            lastName: lastName,
            bio: bio,
            githubUsername: githubUsername,
            username: username,
            mobile: mobile
          }
        }
      },
      include: {
        profile: true
      }
    })
    return updatedUser
  }
}
