import dbClient from '../utils/dbClient.js'
import bcrypt from 'bcrypt'

export default class User {
  /**
   * This is JSDoc - a way for us to tell other developers what types functions/methods
   * take as inputs, what types they return, and other useful information that JS doesn't have built in
   * @tutorial https://www.valentinog.com/blog/jsdoc
   *
   * @param { { id: int, cohortId: int, email: string, profile: { firstName: string, lastName: string, bio: string, githubUrl: string } } } user
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
      user.profile?.githubUrl,
      user.password,
      user.role
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const { firstName, lastName, email, bio, githubUrl, password } = json
    const passwordHash = await bcrypt.hash(password, 8)

    return new User(
      null,
      null,
      firstName,
      lastName,
      email,
      bio,
      githubUrl,
      passwordHash
    )
  }

  constructor(
    id,
    cohortId,
    firstName,
    lastName,
    email,
    bio,
    githubUrl,
    passwordHash = null,
    role = 'STUDENT'
  ) {
    this.id = id
    this.cohortId = cohortId
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.bio = bio
    this.githubUrl = githubUrl
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
        githubUrl: this.githubUrl
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
      role: this.role,
      profile: {
        create: {
          firstName: this.firstName,
          lastName: this.lastName,
          bio: this.bio,
          githubUrl: this.githubUrl
        }
      }
    }

    if (this.cohortId) {
      data.cohort = {
        connectOrCreate: {
          id: this.cohortId
        }
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

  static emailValidation(email) {
    // regex explanation:
    // matches a-z, digits, and all special characters, including full stops before the @ symbol.
    // After the @ it makes sure the domain name of the email address ends in a dot. and only includes a-z, digits or hyphens.
    // and then the final part of the email address is the top-level domain name which may only contain a-z, digits, or hyphen.
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/gm
    return emailRegex.test(email.toLowerCase())
  }

  static passwordValidation(password) {
    // regex explanation:
    // Checks to make sure that the password has at least one digit (0-9), - (?=.*\d)
    // Checks it has at least one special character in the provided list, with some escape characters to allow backslashes etc - (?=.*[!?@#$%^&*()+_{}<>`~\\\-/.,[\]])
    // Checks it has at east one lowercase a-z character, - (?=.*[a-z])
    // Checks it has at least one uppercase a-z character, - (?=.*[A-Z])
    // Checks that it is at least 8 characters long. - .{8,}
    const passwordRegex =
      /^(?=.*\d)(?=.*[!?@#$%^&*()+_{}<>`~\\\-/.,[\]])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return passwordRegex.test(password)
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

  static async updateById(id, data) {
    const query = {
      where: {
        id: id
      },
      data: data,
      include: {
        profile: true
      }
    }

    if (query.data.password) {
      query.data.password = await bcrypt.hash(query.data.password, 8)
    }

    const updatedUser = await dbClient.user.update(query)

    return updatedUser
  }

  static async findAllTeachers() {
    console.log('all teacher')
    const query = {
      where: {
        role: 'TEACHER'
      },
      include: {
        profile: true
      }
    }
    const foundTeachers = await dbClient.user.findMany(query)
    console.log(foundTeachers)
    return foundTeachers.map((user) => User.fromDb(user))
  }
}
