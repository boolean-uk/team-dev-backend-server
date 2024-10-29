/* eslint-disable prettier/prettier */
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
      user.profile?.mobile,
      user.profile?.specialism,
      user.profile?.imageUrl,
      user.profile?.jobTitle,
      user.profile?.startDate,
      user.profile?.endDate,
      user.password,
      user.role
    )
  }

  static async fromJson(json) {
    const passwordHash = await bcrypt.hash(json.password, 8)

    return new User(
      null,
      null,
      json.firstName,
      json.lastName,
      json.email,
      json.biography,
      json.githubUsername,
      json.mobile,
      json.specialism,
      json.imageUrl,
      json.jobTitle,
      json.startDate,
      json.endDate,
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
    githubUsername,
    mobile,
    specialism,
    imageUrl,
    jobTitle = null,
    startDate = null,
    endDate = null,
    passwordHash = null,
    role = 'STUDENT'
  ) {
    this.id = id
    this.cohortId = cohortId
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.bio = bio
    this.githubUsername = githubUsername
    this.mobile = mobile
    this.specialism = specialism
    this.imageUrl = imageUrl
    this.jobTitle = jobTitle
    this.startDate = startDate
    this.endDate = endDate
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
        githubUsername: this.githubUsername,
        mobile: this.mobile,
        specialism: this.specialism,
        imageUrl: this.imageUrl,
        jobTitle: this.jobTitle,
        startDate: this.startDate,
        endDate: this.endDate
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
          githubUsername: this.githubUsername
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

  static async findManyByFirstName(firstName) {
    return User._findMany('firstName', firstName)
  }

  static async findManyByLastName(lastName) {
    return User._findMany('lastName', lastName)
  }

  static async findByName(name) {
    // Split the name into first and last name if it contains a space
    let [firstName, lastName] = name.split(' ')

    // If it's a full name
    if (lastName) {
      let users = await User._findWithFullName({
        firstName: firstName,
        lastName: lastName
      })
      if (users.length > 0) {
        return users
      }
    }
    // If it's a single name
    let users = await this.findManyByFirstName(name)
    if (users.length > 0) {
      return users
    } else {
      users = await this.findManyByLastName(name)
      if (users.length > 0) {
        return users
      }
    }

    return null
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

  static async _findWithFullName(where) {
    const query = {
      include: {
        profile: true
      }
    }

    if (where) {
      query.where = {
        profile: where
      }
    }

    const foundUsers = await dbClient.user.findMany(query)

    return foundUsers.map((user) => User.fromDb(user))
  }

  /**
   * Updates the user in the database with current instance values
   * @returns {Promise<User>} Updated user instance
   */
  async update() {
    const data = {
      email: this.email,
      role: this.role
    }

    if (this.passwordHash) {
      data.password = this.passwordHash
    }

    const updated = {
      firstName: this.firstName,
      lastName: this.lastName,
      bio: this.bio,
      githubUsername: this.githubUsername,
      mobile: this.mobile,
      specialism: this.specialism,
      imageUrl: this.imageUrl,
      jobTitle: this.jobTitle,
      startDate: this.startDate,
      endDate: this.endDate
    }

    data.profile = {
      upsert: {
        create: updated,
        update: updated
      }
    }

    if (this.cohortId) {
      data.cohort = {
        connect: {
          id: this.cohortId
        }
      }
    }

    const updatedUser = await dbClient.user.update({
      where: {
        id: this.id
      },
      data,
      include: {
        profile: true
      }
    })

    return User.fromDb(updatedUser)
  }

  static async deleteById(id) {
    const deletedUser = await dbClient.user.delete({
      where: { id },
      include: {
        profile: true
      }
    })

    return User.fromDb(deletedUser)
  }
}
