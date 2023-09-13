import randomstring from 'randomstring'

import mockedSecrets from '../mocks/secrets.json'

const secrets = mockedSecrets.data

export const getSecrets = async () => {
  return secrets
}

export const addSecret = async (credential) => {
  const value = randomstring.generate({ length: 38, capitalization: 'lowercase' })
  const secretId = randomstring.generate({ length: 38, capitalization: 'lowercase' })

  secrets.push({
    ...credential,
    secretId,
    value: `***${value.slice(-3)}`,
  })

  return {
    secretId,
    value
  }
}
