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
      user.profile?.imageUrl,
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
      githubUrl,
      password,
      imageUrl
    } = json

    const passwordHash = await bcrypt.hash(password, 8)

    return new User(
      null,
      null,
      firstName,
      lastName,
      email,
      biography,
      githubUrl,
      imageUrl,
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
    imageUrl,
    passwordHash = null,
    role = 'STUDENT'
  ) {
    this.id = id
    this.cohortId = cohortId
    this.firstName = firstName || 'unknown'
    this.lastName = lastName || 'unknown'
    this.email = email
    this.bio = bio
    this.githubUrl = githubUrl
    this.imageUrl = imageUrl
    this.passwordHash = passwordHash
    this.role = role
  }

  toJSON() {
    return {
      user: {
        id: this.id,
        cohort_id: this.cohortId,
        role: this.role,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        biography: this.bio,
        githubUrl: this.githubUrl,
        imageUrl: this.imageUrl
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

    data.profile = {
      create: {
        firstName: this.firstName,
        lastName: this.lastName,
        bio: this.bio,
        githubUrl: this.githubUrl,
        imageUrl: this.imageUrl,
        role: this.role,
        specialism: this.specialism,
        cohort: this.cohort,
        startDate: this.startDate,
        endDate: this.endDate,
        email: this.email,
        mobile: this.mobile,
        password: this.passwordHash
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

  static async findManyByFirstNameOrLastName(name) {
    const splitName = name.split(' ')

    const promise = Promise.all(
      splitName.map((word) => {
        return User._findManyOr(
          {
            key: 'firstName',
            value: { mode: 'insensitive', contains: word }
          },
          { key: 'lastName', value: { mode: 'insensitive', contains: word } }
        )
      })
    )

    let results = await promise
    results = results.flat()

    const foundUsers = []
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

    return foundUsers.sort((a, b) => b.count - a.count)
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

  static async _findManyOr(...keyValue) {
    const query = keyValue.map(({ key, value }) => ({
      [key]: value
    }))

    const foundUsers = await dbClient.user.findMany({
      where: {
        profile: {
          OR: query
        }
      },
      include: {
        profile: true
      }
    })

    return foundUsers.map((user) => User.fromDb(user))
  }
}
