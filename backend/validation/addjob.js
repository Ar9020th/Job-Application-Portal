const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateJobInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : "";
  data.reqSkillSets = !isEmpty(data.reqSkillSets) ? data.reqSkillSets : "";
  data.duration = !isEmpty(data.duration) ? data.duration : 0;
  data.salary = !isEmpty(data.salary) ? data.salary : 0;
  data.dateOfPosting = !isEmpty(data.dateOfPosting) ? data.dateOfPosting : 0;
  data.applicationDeadline = !isEmpty(data.applicationDeadline)
    ? data.applicationDeadline
    : 0;
  data.maxNumOfApplications = !isEmpty(data.maxNumOfApplications)
    ? data.maxNumOfApplications
    : 0;
  data.maxNumOfPositions = !isEmpty(data.maxNumOfPositions)
    ? data.maxNumOfPositions
    : 0;
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title is required";
  }
  if (Validator.isEmpty(data.reqSkillSets)) {
    errors.reqSkillSets = "Skill Set Requirements needs to be furnished";
  }
  if (data.dateOfPosting === 0) {
    errors.dateOfPosting = "Date of Posting is required";
  }
  if (data.applicationDeadline === 0) {
    errors.applicationDeadline = "Deadline of Application is required";
  }
  if (data.maxNumOfApplications === 0) {
    errors.maxNumOfApplications = "Maximum Number of Applications is required";
  }
  if (data.maxNumOfPositions === 0) {
    errors.maxNumOfPositions = "Maximum Number of Positions is required";
  }
  if (data.duration === 0) {
    errors.duration = "Duration is required";
  }
  if (data.salary === 0) {
    errors.salary = "Salary is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
