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
    return "studentID or studentRoleID body is missing..";
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

export{validateEditUserStatusData, validateEditUserRoleData};