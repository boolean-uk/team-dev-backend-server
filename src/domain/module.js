import dbClient from '../utils/dbClient.js'

export async function getModules() {
  return await dbClient.module.findMany({
    include: {
      units: true
    }
  })
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
