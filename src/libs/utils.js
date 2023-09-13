export const maskCharactersFromIndex = (inputString, startIndex) => {
  if (startIndex < 0 || startIndex >= inputString.length) {
    return inputString;
  }

  const regex = new RegExp(`(.{${startIndex}})(.*)`);
  return inputString.replace(regex, (_match, prefix, suffix) => prefix + '*'.repeat(suffix.length));
}

export const copyToClipboard = async (value, messageApi) => {
  try {
    navigator.clipboard.writeText(value)
    messageApi.open({
      type: 'success',
      content: 'Credential copied successfully',
    })
  } catch (error) {
    console.error(error)
  }
}
