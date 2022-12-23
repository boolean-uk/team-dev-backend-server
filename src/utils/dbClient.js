import prisma from '@prisma/client'

export const errorCodes = {
  violateRelation: 'P2014',
  recordNotFound: 'P2025',
  uniqueConstraint: 'P2002'
}

const dbClient = new prisma.PrismaClient()

export default dbClient
