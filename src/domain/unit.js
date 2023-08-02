import dbClient from '../utils/dbClient.js'

export async function getUnitById(unitId, name) {
  return await dbClient.unit.findUnique({
    where: {
      id: unitId,
      Name: name
    },
    include: {
      exercises: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}
