import mockedSecrets from '../mocks/secrets.json'

const secrets = mockedSecrets.data

export const getSecrets = async () => {
  return secrets
}

export const addSecret = async (credential) => {
  secrets.push(credential)
  return credential
}
