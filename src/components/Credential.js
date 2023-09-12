import { useEffect, useState } from 'react'
import { maskCharactersFromIndex } from '../libs/utils'
import { getCredential } from '../services/credential'

import { Alert, Button } from 'antd'
import { CopyOutlined, KeyOutlined } from '@ant-design/icons'

const Credential = () => {

  const [credential, setCredential] = useState({ value: '' })
  const [showCredentialToast, setShowCredentialToast] = useState(false)

  useEffect(() => {
    const fetchCredential = async () => {
      const response = await getCredential()
      setCredential(response)
    }
    fetchCredential()
  }, [credential])

  const copyToClipboard = async () => {
    try {
      navigator.clipboard.writeText(credential.value)
      setShowCredentialToast(true)
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        setShowCredentialToast(false)
      }, 3000);
    }
  }

  return (
    <section className='credentials'>
      <h4>Credentials</h4>
      <p>
        Client ID and Secrets are used to authenticate your merchant in our
        gateway. Please don't share or save those credentials in an unsafe
        location.
      </p>

      <div className='credential-wrapper'>
        <span className='credential'>
          <Button
            shape='circle'
            icon={<KeyOutlined />}
          />
          <span className='credential-value'>
            {maskCharactersFromIndex(credential.value, 8)}
          </span>
          <Button
            type='primary'
            shape='circle'
            icon={<CopyOutlined />}
            onClick={copyToClipboard}
          />
        </span>
      </div>

      <Alert className={`credential-alert ${showCredentialToast ? 'show' : ''}`} message="Credential copied successfully" type="success" />
    </section>
  )
}

export default Credential
