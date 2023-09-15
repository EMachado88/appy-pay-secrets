import axios from 'axios'

import { apiUrl } from './config'

export const getCredential = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/99/credentials/1`)
    return data.data
  } catch (error) {
    return error
  }
}
