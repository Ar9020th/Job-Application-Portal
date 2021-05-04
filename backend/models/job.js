const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  maxNumOfApplications: {
    type: Number,
    required: true,
    default: 0,
  },
  maxNumOfPositions: {
    type: Number,
    required: true,
    default: 0,
  },
  dateOfPosting: {
    type: Date,
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  reqSkillSets: {
    type: [String],
    required: true,
  },
  typeOfJob: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
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
  applicants: [
    {
      applicantId: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      sop: {
        type: String,
        required: true,
      },
      status: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
      dateOfJoining: {
        type: Date,
      },
      dateOfApplication: {
        type: Date,
      },
    },
  ],
});

module.exports = Recruiter = mongoose.model("jobs", JobSchema);
