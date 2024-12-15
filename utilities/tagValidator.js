// Validator function for tag data
const validateTagData = (data) => {
  if (!data) {
    return "Tag data is missing.";
  }

  if (typeof data.tagName !== "string" || data.tagName.trim().length === 0) {
    return "Invalid or missing tagName.";
  }

  if (
    typeof data.tagAbbrevation !== "string" ||
    data.tagAbbrevation.trim().length === 0
  ) {
    return "Invalid or missing tagAbbrevation.";
  }

  return null;
};

// Validator function for tag ID
const validateTagId = (id) => {
  if (!id) {
    return "Tag ID is required.";
  }

  if (isNaN(id)) {
    return "Tag ID must be a valid number.";
  }

  return null;
};

export { validateTagData, validateTagId };
