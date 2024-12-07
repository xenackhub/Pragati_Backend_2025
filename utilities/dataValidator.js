import validator from "validator";

// function that validates email
const validateEmail = (email) => {
  if (
    typeof email == "string" &&
    email.length > 0 &&
    email.length <= 255 &&
    validator.isEmail(email)
  ) {
    return true;
  }
  return false;
};

// function that validates hashed password (64 bit hashing)
const validatePassword = (password) => {
  if (
    typeof password === "string" &&
    password != null &&
    password.length > 8 &&
    password.length <= 255 &&
    !validator.contains(password, "-" || "'")
  ) {
    return true;
  }
  return false;
};

export { validateEmail, validatePassword };
