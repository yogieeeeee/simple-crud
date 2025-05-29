import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRoute from "./routes/user.route.js"

dotenv.config()

const app = express()
const port = 3001

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    })
    console.log("koneksi ke database berhasil")
  } catch (error) {
    console.error("terjadi kesalahan dalam koneksi bos!", error)
  }
}

app.use(cors())
app.use(express.json())
app.use(userRoute)

dbConnect()
app.listen(port, () => {
  console.log(`server sedang berjalan di port ${port}`)
})
