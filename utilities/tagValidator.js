
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
  
  export { validateTagData };
