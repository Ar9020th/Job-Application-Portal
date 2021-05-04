const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecruiterSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  contactno: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
});

module.exports = Recruiter = mongoose.model("recruiters", RecruiterSchema);
