const validateEditUserStatusData = ( studentID, accountStatus) => {
    if ( !studentID && !accountStatus) {
        return "studentID or accountStatus body is missing.";
    }

  // 1. Check userID
    if (studentID === null) {
        return "User ID is required.";
    }
    if (isNaN(studentID)) {
        return "User ID must be a valid number.";
    }

  // 2. Check accountStatus
    if (!["0", "1", "2"].includes(accountStatus)) {
        return "Invalid accountStatus. Must be '0', '1', or '2'.";
    }

  return null; // No errors
};
export{validateEditUserStatusData};