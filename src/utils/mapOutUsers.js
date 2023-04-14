const mapOutUsers = (users) => {
  const objectOfUsers = users.map((item) => item.toJSON().user)
  return objectOfUsers
}

export default mapOutUsers
