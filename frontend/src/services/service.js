import axios from "axios"
export const getUsers = async () => {
  const response = await axios.get("http://localhost:3000/")
  let data = response.data
  console.log(data)
  //setUsers(response.data)
}

getUsers()
