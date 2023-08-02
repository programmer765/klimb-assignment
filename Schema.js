import mongoose from "mongoose";

const dataSchema = mongoose.Schema({
  name: String,
  candidateData: Array,
});

export default mongoose.model("data", dataSchema);
