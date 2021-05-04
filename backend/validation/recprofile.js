const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateProfileInput(data) {
  let errors = {};
  data.contactno = !isEmpty(data.contactno) ? data.contactno : "";
  data.bio = !isEmpty(data.bio) ? data.bio : "";
  if (Validator.isEmpty(data.contactno)) {
    errors.contactno = "Contact Number is required";
  }
  if (Validator.isEmpty(data.bio)) {
    errors.bio = "Bio is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
