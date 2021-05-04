const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateEducationInput(data) {
  let errors = {};
  data.institution_name = !isEmpty(data.institution_name)
    ? data.institution_name
    : "";
  data.startdate = !isEmpty(data.startdate) ? data.startdate : 0;
  if (Validator.isEmpty(data.institution_name)) {
    errors.institution_name = "Institution name is required";
  }

  if (data.startdate == 0) {
    errors.startdate = "Start Date is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
