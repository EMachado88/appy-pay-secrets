import { useEffect, useState } from 'react'
import { copyToClipboard, maskCharactersFromIndex } from '../libs/utils'
import { getCredential } from '../services/credential'

import { Button, message } from 'antd'
import { CopyOutlined, KeyOutlined } from '@ant-design/icons'

const Credential = () => {

  const [credential, setCredential] = useState({ value: '' })
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    const fetchCredential = async () => {
      const response = await getCredential()
      setCredential(response)
    }
    fetchCredential()
  }, [])

  return (
    <section className='credentials' data-testid='credential-component'>
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
          <code className='credential-value'>
            {maskCharactersFromIndex(credential.value || '', 8)}
          </code>
          <Button
            type='primary'
            shape='circle'
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(credential.value, messageApi)}
          />
        </span>
      </div>

      {contextHolder}
    </section>
  )
}

export default Credential
