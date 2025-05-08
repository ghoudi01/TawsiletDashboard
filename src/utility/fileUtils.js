// src/utils/fileUtils.js
export const validateFileType = (filename, type) => {
    if (!filename) return false;
    const extension = filename.split('.').pop().toLowerCase();
    return extension === type.toLowerCase();
  };