const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ApplicantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  education: [
    {
      institution_name: {
        type: String,
        required: true,
      },
      startdate: {
        type: Number,
        required: true,
      },
      enddate: {
        type: Number,
        default: 0,
      },
    },
  ],
  skills: {
    type: [String],
    required: true,
  },
  rating: {
    sumofratings: {
      type: Number,
      default: 0,
    },
    people: {
      type: Number,
      default: 0,
    },
  },
  applied: [
    {
      jobId: {
        type: Schema.Types.ObjectId,
        ref: "jobs",
      },
      status: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = Applicant = mongoose.model("applicants", ApplicantSchema);
