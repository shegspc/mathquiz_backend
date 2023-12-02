import mongoose from "mongoose";
const Schema = mongoose.Schema;


const multiplicationResultSchema = new Schema(
  {
    score: {
      type: Number,
      required: true
    },
    questionCount: {
      type: Number,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('MultiplicationResult', multiplicationResultSchema);
