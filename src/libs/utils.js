export const maskCharactersFromIndex = (inputString, startIndex) => {
  if (startIndex < 0 || startIndex >= inputString.length) {
    return inputString;
  }

  const regex = new RegExp(`(.{${startIndex}})(.*)`);
  return inputString.replace(regex, (_match, prefix, suffix) => prefix + '*'.repeat(suffix.length));
}
