function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false
  const d = new Date(str)
  return d instanceof Date && !isNaN(d) && d.toISOString() === str // valid date
}
const date = new Date('2011-10-05')
console.log(date)
console.log(isIsoDate('2011-10-05T14:48:00.000Z'))
console.log(isIsoDate(date))

console.log(isIsoDate('2018-11-10T11:22:33+00:00'))

console.log(isIsoDate('2011-10-05T14:99:00.000Z')) // invalid time part

// console.log(new Date('2011-05-10'))

// console.log(new Date('11-11-2023').toISOString())

const validDate = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test('2011-13-13')
console.log(validDate)
// const validDate2 = new Date('2011-12-05').toISOString()
// console.log(validDate2)
