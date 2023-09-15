import axios from 'axios'
import dayjs from 'dayjs'

import { apiUrl } from './config'

export const getSecrets = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/99/secrets`)
    return data.data
  } catch (error) {
    return error
  }
}

export const addSecret = async (secret, secrets, setSecrets, buildAlert) => {
  const { displayName, startDateTime, endDateTime, isActive } = secret

  try {
    const { data } = await axios.post(`${apiUrl}/99/secrets`, {
      displayName,
      startDateTime,
      endDateTime,
      isActive,
    })

    const { secretId, value } = data

    setSecrets([
      ...secrets,
      {
        key: secretId,
        name: secret.displayName,
        created: dayjs(secret.startDateTime).format('DD/MM/YYYY HH:mm'),
        valid: dayjs(secret.endDateTime).format('DD/MM/YYYY HH:mm'),
        secret: `***${value.slice(-3)}`,
        status: buildAlert(secret)
      },
    ])

    return { secretId, value }
  } catch (error) {
    return error
  }
}
