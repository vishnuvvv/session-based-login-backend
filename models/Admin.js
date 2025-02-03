// need to make edits.

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
});

export default mongoose.model("Admin", adminSchema);
