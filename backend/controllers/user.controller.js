import User from "../models/user.model.js"

export const createUser = async (req, res) => {
  try {
    const {name, age, gender} = req.body
    const user = new User({name, age, gender})
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const updateUser = async (req, res) => {
  try {
    const {id} = req.params
    const {name, age, gender} = req.body

    const user = await User.findByIdAndUpdate(
      id,
      {name, age, gender},
      {new: true, runValidators: true}
    )

    if (!user) {
      return res.status(404).json({message: "User not found"})
    }

    res.json(user)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

export const deleteUser = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({message: "User not found"})
    }

    res.json({message: "User deleted successfully"})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
