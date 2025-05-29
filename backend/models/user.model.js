import mongoose from "mongoose";

const User = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  }
});

export default mongoose.model("user", User);

//export default User;
