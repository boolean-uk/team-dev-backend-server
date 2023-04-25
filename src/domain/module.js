import dbClient from '../utils/dbClient.js'

export async function getModules() {
  return await dbClient.module.findMany()
}
