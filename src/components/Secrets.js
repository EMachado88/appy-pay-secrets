import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { copyToClipboard } from '../libs/utils'
import { getSecrets, addSecret } from '../services/secrets'

import {
  Alert,
  Button,
  DatePicker,
  Input,
  message,
  Modal,
  Space,
  Switch,
  Table,
} from 'antd'
import { CopyOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Created Date',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: 'Valid Until',
    dataIndex: 'valid',
    key: 'valid',
  },
  {
    title: 'Secret',
    dataIndex: 'secret',
    key: 'secret',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
]

const linesPerPage = 5

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

  const fetchSecrets = async () => {
    const response = await getSecrets()

    const curatedSecrets = response.map((credential) => {
      return {
        key: credential.secretId,
        name: credential.displayName,
        created: dayjs(credential.startDateTime).format('DD/MM/YYYY HH:mm'),
        valid: dayjs(credential.endDateTime).format('DD/MM/YYYY HH:mm'),
        secret: credential.value,
        status: (
          <Alert
            message={`${credential.isActive ? 'Active' : 'Not Active'}`}
            type={`${credential.isActive ? 'success' : 'error'}`}
            style={{ textAlign: 'center' }}
          />
        ),
      }
    })

    setSecrets(curatedSecrets)
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
    if (!displayName.length) {
      messageApi.open({
        type: 'error',
        content: 'Display name is required',
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

  const onDatesChange = (value) => {
    const [selectedStartDateTime, selectedEndDateTime] = value ?? [
      dayjs(Date()),
      dayjs(Date()).add(1, 'weeks'),
    ]
    setStartDateTime(selectedStartDateTime)
    setEndDateTime(selectedEndDateTime)
  }

  const onActiveChange = (checked) => {
    setIsActive(checked)
  }

  useEffect(() => {
    fetchSecrets()
  }, [])

  return (
    <section className='secrets'>
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
          okButtonProps={{ loading: isAddingSecret }}
          cancelButtonProps={{ loading: isAddingSecret }}
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
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                  type='primary'
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
              <p>This is your newly generated secret. Keep in mind it'll only be shown this time, so copy it and store it somewhere safe.</p>
              <span className='credential'>
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
            <Space
              direction='vertical'
              size='middle'
            >
              <Input
                placeholder='Display name'
                value={displayName}
                onChange={onDisplayNameChange}
              />
              <RangePicker
                showTime
                value={[startDateTime, endDateTime]}
                format='DD/MM/YYYY HH:mm'
                onChange={onDatesChange}
              />
              <span>
                Active:{' '}
                <Switch
                  defaultChecked
                  onChange={onActiveChange}
                />
              </span>
            </Space>
          )}
        </Modal>
      </div>

      <div className='secrets-table'>
        <Table
          dataSource={secrets}
          columns={columns}
          pagination={{
            pageSize: linesPerPage,
            showTotal: (total, range) =>
              `Lines ${range.toString().replace(',', '-')} of ${total}`,
          }}
        />
      </div>

      {contextHolder}
    </section>
  )
}

export default Secrets
