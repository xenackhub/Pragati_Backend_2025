// Validator function for tag data
const validateTagData = (data) => {
  if (!data) {
    return "Tag data is missing.";
  }

  if (typeof data.tagName !== "string" || data.tagName.trim().length === 0) {
    return "Invalid or missing tagName.";
  }

  if (data.tagName.length > 255) {
    return "Tag Name cannot exceed 255 characters.";
  }

  if (
    typeof data.tagAbbrevation !== "string" || data.tagAbbrevation.trim().length === 0
  ) {
    return "Invalid or missing tagAbbrevation.";
  }

  if (data.tagAbbrevation.length > 10) {
    return "Tag Abbrevation cannot exceed 10 characters.";
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
