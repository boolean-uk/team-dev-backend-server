import dbClient from '../utils/dbClient.js'
import bcrypt from 'bcrypt'
import Note from './note.js'

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
    let notes = null
    if (user.notes) {
      notes = user.notes.map(
        (note) => new Note(note.id, note.content, note.userId)
      )
    }
    return new User(
      user.id,
      user.cohortId,
      user.profile?.firstName,
      user.profile?.lastName,
      user.email,
      user.profile?.bio,
      user.profile?.githubUrl,
      user.password,
      user.role,
      notes
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const { firstName, lastName, email, biography, githubUrl, password } = json

    const passwordHash = await bcrypt.hash(password, 8)

    return new User(
      null,
      null,
      firstName,
      lastName,
      email,
      biography,
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
    role = 'STUDENT',
    notes = null
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
    this.notes = notes
  }

  toJSON() {
    const user = {
      user: {
        id: this.id,
        cohort_id: this.cohortId,
        role: this.role,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        biography: this.bio,
        githubUrl: this.githubUrl,
        notes: this.notes
      }
    }
    if (this.notes === null) {
      delete user.user.notes
    }
    return user
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
          githubUrl: this.githubUrl
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

  static async findById(id, includeNotes) {
    return User._findByUnique('id', id, includeNotes)
  }

  static async findManyByName(firstName, lastName) {
    if (!firstName && !lastName) {
      throw new Error('Must contain at least firstName or lastName.')
    }

    const profileQueryObjects = []
    if (firstName) {
      profileQueryObjects.push({ key: 'firstName', value: firstName })
    }
    if (lastName) {
      profileQueryObjects.push({ key: 'lastName', value: lastName })
    }
    return User._findMany(profileQueryObjects)
  }

  static async findAll() {
    return User._findMany()
  }

  static async _findByUnique(key, value, notes = false) {
    const foundUser = await dbClient.user.findUnique({
      where: {
        [key]: value
      },
      include: {
        profile: true,
        notes
      }
    })

    if (foundUser) {
      return User.fromDb(foundUser)
    }

    return null
  }

  static async _findMany(keyValueList = []) {
    const query = {
      include: {
        profile: true
      }
    }

    const profileQueryObjects = keyValueList.map(({ key, value }) => {
      return {
        [key]: {
          contains: value,
          mode: 'insensitive'
        }
      }
    })

    query.where = {
      profile: {
        AND: profileQueryObjects
      }
    }

    if (profileQueryObjects.length === 1) {
      query.where.profile = {
        ...profileQueryObjects[0]
      }
    }

    const foundUsers = await dbClient.user.findMany(query)

    return foundUsers.map((user) => User.fromDb(user))
  }
}
