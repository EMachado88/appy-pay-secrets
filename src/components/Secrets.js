import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { copyToClipboard } from '../libs/utils'
import { getSecrets, addSecret } from '../services/secrets'

import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Space,
  Switch,
} from 'antd'
import { CopyOutlined, KeyOutlined } from '@ant-design/icons'

import SecretsTable from './SecretsTable'

const Secrets = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const [secrets, setSecrets] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddingSecret, setAddingSecret] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [startDateTime, setStartDateTime] = useState(dayjs(Date()))
  const [endDateTime, setEndDateTime] = useState(startDateTime.add(1, 'weeks'))
  const [isActive, setIsActive] = useState(true)
  const [newSecret, setNewSecret] = useState('')

  const buildAlert = (secret) => {
    let message
    let type

    if (secret.isActive) {
      if (dayjs(Date()).add(30, 'days').isBefore(dayjs(secret.endDateTime))) {
        message = 'Active'
        type = 'success'
      } else {
        message = 'Expiring soon'
        type = 'warning'
      }
    } else {
      message = 'Not Active'
      type = 'error'
    }

    return (
      <Alert
        message={message}
        type={type}
        style={{ textAlign: 'center' }}
      />
    )
  }

  const handleCancel = () => {
    setIsModalOpen(false)

    if (newSecret.length) {
      setDisplayName('')
      setStartDateTime(dayjs(Date()))
      setEndDateTime(startDateTime.add(1, 'weeks'))
      setIsActive(true)
      setNewSecret('')
    }
  }

  const handleAdd = async () => {
    if (!displayName.length || !endDateTime) {
      messageApi.open({
        type: 'error',
        content: 'All fields are required',
      })
      return
    }

    setAddingSecret(true)

    try {
      const response = await addSecret({
        displayName,
        startDateTime: startDateTime.format('YYYY-MM-DD HH:mm:ss'),
        endDateTime: endDateTime.format('YYYY-MM-DD HH:mm:ss'),
        isActive,
      })

      setNewSecret(response.value)
      await fetchSecrets()
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'There was an error processing your request',
      })
      console.error(error)
    } finally {
      setAddingSecret(false)
    }
  }

  const onDisplayNameChange = (event) => {
    setDisplayName(event.target.value)
  }

  const onDateChange = (value) => {
    const selectedEndDateTime = value ?? dayjs(Date()).add(1, 'weeks')
    setEndDateTime(selectedEndDateTime)
  }

  const onActiveChange = (checked) => {
    setIsActive(checked)
  }

  const fetchSecrets = useCallback(async () => {
    const response = await getSecrets()

    const curatedSecrets = response.map((secret) => {
      return {
        key: secret.secretId,
        name: secret.displayName,
        created: dayjs(secret.startDateTime).format('DD/MM/YYYY HH:mm'),
        valid: dayjs(secret.endDateTime).format('DD/MM/YYYY HH:mm'),
        secret: secret.value,
        status: buildAlert(secret),
      }
    })

    setSecrets(curatedSecrets)
  }, [])

  useEffect(() => {
    fetchSecrets()
  }, [fetchSecrets])

  return (
    <section
      className='secrets'
      data-testid='secrets-component'
    >
      <div className='secrets-header'>
        <h3>Secrets list</h3>
        <Button
          type='primary'
          onClick={() => setIsModalOpen(true)}
        >
          Add secret
        </Button>

        <Modal
          title='Add secret'
          open={isModalOpen}
          okText='Add'
          footer={
            newSecret.length ? (
              <Button
                type='primary'
                onClick={handleCancel}
              >
                Close
              </Button>
            ) : (
              <>
                <Button
                  loading={isAddingSecret}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  loading={isAddingSecret}
                  onClick={handleAdd}
                >
                  Add
                </Button>
              </>
            )
          }
          onCancel={handleCancel}
        >
          {newSecret.length ? (
            <>
              <p>
                This is your newly generated secret. Keep in mind it'll only be
                shown this time, so copy it and store it somewhere safe.
              </p>
              <span className='credential'>
              <Button
                shape='circle'
                icon={<KeyOutlined />}
              />
                <code className='credential-value'>{newSecret}</code>
                <Button
                  type='primary'
                  shape='circle'
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(newSecret, messageApi)}
                />
              </span>
            </>
          ) : (
            <Form
              name='new-secret'
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 16,
              }}
            >
              <Space
                direction='vertical'
                size='middle'
              >
                <Form.Item
                  label='Name: '
                  name='name'
                >
                  <Input
                    placeholder='Display name'
                    value={displayName}
                    onChange={onDisplayNameChange}
                  />
                </Form.Item>
                <Form.Item
                  label='Expiry date: '
                  name='expiry-date'
                  initialValue={endDateTime}
                >
                  <DatePicker
                    showTime
                    allowClear={false}
                    format='DD/MM/YYYY HH:mm'
                    onChange={onDateChange}
                  />
                </Form.Item>
                <Form.Item
                  label='Active: '
                  name='active'
                >
                  <Switch
                    checked={isActive}
                    onChange={onActiveChange}
                  />
                </Form.Item>
              </Space>
            </Form>
          )}
        </Modal>
      </div>

      <SecretsTable secrets={secrets} />

      {contextHolder}
    </section>
  )
}

export default Secrets
