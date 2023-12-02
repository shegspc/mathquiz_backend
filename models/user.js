import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  multiplicationResults: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MultiplicationResult'
    }
  ],
  arithmeticResults: [
     {
      type: Schema.Types.ObjectId,
      ref: 'ArithmeticResult'
     }
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model("User", userSchema);


