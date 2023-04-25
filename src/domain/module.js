import dbClient from '../utils/dbClient.js'

export async function getModules() {
  return await dbClient.module.findMany()
}

export async function getModuleById(id) {
  return await dbClient.module.findUnique({
    where: {
      id: id
    },
    include: {
      units: true
    }
  })
}
