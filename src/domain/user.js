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
      user.profile?.specialism,
      user.profile?.phone,
      user.profile?.profileImageUrl,
      user.role
    )
  }

  static async fromJson(json) {
    const {
      firstName,
      lastName,
      email,
      bio,
      githubUrl,
      password,
      cohortId,
      specialism,
      phone,
      profileImageUrl
    } = json

    const passwordHash = await bcrypt.hash(password, 8)

    return new User(
      null,
      cohortId,
      firstName,
      lastName,
      email,
      bio,
      githubUrl,
      passwordHash,
      specialism,
      phone,
      profileImageUrl
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
    specialism,
    phone,
    profileImageUrl,
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
    this.specialism = specialism
    this.phone = phone
    this.profileImageUrl = profileImageUrl
    this.role = role
  }

  toJSON() {
    return {
      user: {
        id: this.id,
        cohort_id: this.cohortId,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        biography: this.bio,
        githubUrl: this.githubUrl,
        specialism: this.specialism,
        phone: this.phone,
        profileImageUrl: this.profileImageUrl,
        role: this.role
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
          id: this.cohortId
        }
      }
    }

    if (this.firstName && this.lastName) {
      data.profile = {
        create: {
          firstName: this.firstName,
          lastName: this.lastName,
          bio: this.bio,
          githubUrl: this.githubUrl,
          specialism: this.specialism,
          phone: this.phone,
          profileImageUrl: this.profileImageUrl
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

  static async findByEmail(email) {
    return User._findByUnique('email', email)
  }

  static async findById(id) {
    return User._findByUnique('id', id)
  }

  static async findAll() {
    return User._findMany()
  }

  async updateById() {
    const updatedUser = await dbClient.user.update({
      where: {
        id: this.id
      },
      data: {
        email: this.email,
        password: this.password,
        role: this.role,
        cohortId: this.cohortId,
        profile: {
          update: {
            firstName: this.firstName,
            lastName: this.lastName,
            bio: this.bio,
            githubUrl: this.githubUrl,
            specialism: this.specialism,
            phone: this.phone,
            profileImageUrl: this.profileImageUrl
          }
        }
      },
      include: {
        profile: true
      }
    })

    return User.fromDb(updatedUser)
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
          [key]: {
            equals: value,
            mode: 'insensitive'
          }
        }
      }
    }

    const foundUsers = await dbClient.user.findMany(query)

    return foundUsers.map((user) => User.fromDb(user))
  }

  static async findBy(whereClause) {
    const query = {
      include: {
        profile: true
      }
    }

    if (whereClause !== undefined || whereClause !== {}) {
      query.where = whereClause
    }

    const foundUsers = await dbClient.user.findMany(query)

    return foundUsers.map((user) => User.fromDb(user))
  }
}
