import express from "express"
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js"
const userRoute = express.Router()

userRoute.get("/", getAllUsers)
userRoute.post("/", createUser)
userRoute.put("/:id", updateUser)
userRoute.delete("/:id", deleteUser)

export default userRoute
