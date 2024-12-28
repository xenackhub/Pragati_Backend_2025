

const validateEditUserStatusData = ( studentID, accountStatus) => {
    if ( !studentID || !accountStatus) {
        return "studentID or accountStatus body is missing.";
    }

    if (isNaN(studentID)) {
        return "User ID must be a valid number.";
    }

  // Check accountStatus
    if (!["0", "1", "2"].includes(accountStatus)) {
        return "Invalid accountStatus. Must be '0', '1', or '2'.";
    }

  return null; // No errors
};

const validateEditUserRoleData = (studentID, studentRoleID) => {
  if (!studentID || !studentRoleID) {
    return "studentID or studentRoleID body is missing.";
  }
  if (isNaN(studentID)) {
    return "User ID must be a valid number.";
  }
  if (isNaN(studentRoleID)) {
    return "Role ID must be a valid number.";
  }
  if (![1, 2].includes(Number(studentRoleID))) {
    return "Invalid roleID. Must be 1 or 2.";
  }

  return null; // No errors
};

export const validateNewUserRoleData = (studentRoleID , roleName) => {
  if (!studentRoleID || !roleName) {
    return "studentRoleID or roleName body is missing";
  }
  if (isNaN(studentRoleID )) {
    return "roleID must be a valid number.";
  }
  // Validate roleName
  if ( typeof roleName !== "string") {
    return "roleName must be a valid string.";
  }
  if (roleName.length > 50) {
    return "roleName cannot exceed 50 characters.";
  }

  return null; // No errors
};


export{validateEditUserStatusData, validateEditUserRoleData};