import dbClient from '../utils/dbClient.js'

export async function findModule(key, value) {
  const foundModule = await dbClient.module.findUnique({
    where: {
      [key]: value
    }
  })

  if (foundModule) {
    return foundModule
  }
  return null
}

export async function findByModuleName(name) {
  return await findModule('name', name)
}
// THIS BLOCK OF CODE WILL CHANGE WHEN THE COURSE ENDPOINT IS MADE
export async function createModule(name, courseId) {
  return await dbClient.module.create({
    data: {
      name,
      courses: {
        connectOrCreate: {
          create: {
            id: courseId,
            name: 'Software Development'
          },
          where: {
            id: courseId
          }
        }
      }
    },
    include: {
      courses: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}
// ------------------------------------

export async function updateModuleDetails(moduleId, name, courseId) {
  return await dbClient.module.update({
    where: {
      id: moduleId
    },
    data: {
      name,
      courses: {
        connect: { id: courseId }
      }
    }
  })
}

export async function getModuleById(moduleId) {
  return await dbClient.module.findUnique({
    where: {
      id: moduleId
    },
    include: {
      units: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}
