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

// Function that Validates OTP
const validateOTP = (otp) => {
  if (
    typeof otp === "string" &&
    otp != null &&
    otp.length > 0 &&
    otp.length <= 255
  ) {
    return true;
  }
  return false;
};

const validatePhoneNumber = (phoneNumber) => {
  return (
    typeof phoneNumber === "string" &&
    validator.isMobilePhone(phoneNumber, "en-IN")
  );
};

// Function to  validate standard MySQL VARCHAR(255)
const validateBasicString = (string, len = 255) => {
  return (
    typeof string == "string" &&
    string !== null &&
    validator.isLength(string.trim(), { min: 1, max: len })
  );
};

// Function to validate academic year
const validateAcademicYear = (year) => {
  return Number.isInteger(year);
};

// Function to validate signup data
const validateSignupData = (data) => {
  if (!validateEmail(data.userEmail)) {
    return "Invalid or missing email.";
  }

  if (!validatePassword(data.userPassword)) {
    return "Invalid or missing password.";
  }

  if (typeof data.userName !== "string" || data.userName.trim().length === 0) {
    return "Invalid or missing userName.";
  }

  if (
    typeof data.rollNumber !== "string" ||
    data.rollNumber.trim().length === 0
  ) {
    return "Invalid or missing rollNumber.";
  }

  if (!validatePhoneNumber(data.phoneNumber)) {
    return "Invalid or missing phoneNumber.";
  }

  if (
    typeof data.collegeName !== "string" ||
    data.collegeName.trim().length === 0
  ) {
    return "Invalid or missing collegeName.";
  }

  if (
    typeof data.collegeCity !== "string" ||
    data.collegeCity.trim().length === 0
  ) {
    return "Invalid or missing collegeCity.";
  }

  if (
    typeof data.userDepartment !== "string" ||
    data.userDepartment.trim().length === 0
  ) {
    return "Invalid or missing userDepartment.";
  }

  if (!validateAcademicYear(data.academicYear)) {
    return "Invalid or missing academicYear.";
  }

  if (typeof data.degree !== "string" || data.degree.trim().length === 0) {
    return "Invalid or missing degree.";
  }

  // Validate isAmrita if provided
  if (
    data.isAmrita === null ||
    typeof data.isAmrita != "boolean" ||
    (data.isAmrita !== false && data.isAmrita !== true)
  ) {
    return "Invalid isAmrita Value";
  }
  return null;
};

const validateAddEventsData = (eventData) => {
  if (!validateBasicString(eventData.eventName)) {
    return "Invalid event name";
  }
  if (
    !validateBasicString(eventData.imageUrl) ||
    validator.isURL(eventData.imageUrl)
  ) {
    return "Invalid image url";
  }
  if (typeof data.eventFee != "number" || data.eventFee === null) {
    return "Invalid event fee";
  }
  if (!validateBasicString(eventData.eventName)) {
    return "Invalid event name";
  }
  if (!validateBasicString(eventData.eventDescription, 5000)) {
    return "Invalid description of event";
  }
  if (!validateBasicString(eventData.eventDescription, 1000)) {
    return "Invalid short description of event";
  }
  if (
    eventData.isGroup === null ||
    typeof eventData.isGroup != "boolean" ||
    (eventData.isGroup !== false && eventData.isGroup !== true)
  ) {
    return "Invalid type or value for isGroup";
  } else {
    if (eventData.isGroup === true) {
      if (
        typeof eventData.maxTeamSize != "number" ||
        eventData.maxTeamSize === null ||
        typeof eventData.minTeamSize != "number" ||
        eventData.minTeamSize === null
      ) {
        return "Invalid input for team size!";
      }
    }
  }
  if (!validateBasicString(eventData.eventDate, 1)) {
    return "Invalid event date";
  }
  if (
    typeof eventData.maxRegistrations != "number" ||
    eventData.maxRegistrations === null
  ) {
    return "Invalid max registration count";
  }
  if (
    eventData.isPerHeadFee === null ||
    typeof eventData.isPerHeadFee != "boolean" ||
    (eventData.isPerHeadFee !== false && eventData.isPerHeadFee !== true)
  ) {
    return "Incorrect type for isPerHeadFee";
  }
  if (!validateBasicString(eventData.godName, 50)) {
    return "Invalid god name";
  }
  if (
    !Array.isArray(eventData.tagIDs) ||
    eventData.tagIDs.length === 0 ||
    !eventData.tagIDs.every(
      (tag) => typeof tag === "number" && Number.isInteger(tag)
    )
  ) {
    return "Empty tag list or invalid entries";
  }
  if (
    !Array.isArray(eventData.organizerIDs) ||
    eventData.organizerIDs.length === 0 ||
    !eventData.organizerIDs.every(
      (org) => typeof org === "number" && Number.isInteger(org)
    )
  ) {
    return "Empty organizer list or invalid entries";
  }
  if (typeof eventData.clubID != "number" || eventData.clubID === null) {
    return "Invalid or empty club ID";
  }
  return null;
};

export { validateEmail, validatePassword, validateSignupData, validateOTP, validateAddEventsData };
