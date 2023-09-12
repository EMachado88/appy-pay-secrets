import { useEffect, useState } from 'react'
import moment from 'moment'
import { getSecrets } from '../services/secrets'

import { Alert, Button, Table } from 'antd'

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
  const [secrets, setSecrets] = useState([])

  useEffect(() => {
    const fetchCredential = async () => {
      const response = await getSecrets()

      const curatedSecrets = response.map((credential) => {
        return {
          key: credential.secretId,
          name: credential.displayName,
          created: moment(credential.startDateTime).format('DD/MM/YYYY HH:mm'),
          valid: moment(credential.endDateTime).format('DD/MM/YYYY HH:mm'),
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
    fetchCredential()
  }, [])

  return (
    <section className='secrets'>
      <div className='secrets-header'>
        <h3>Secrets list</h3>
        <Button type='primary'>Add secret</Button>
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
    </section>
  )
}

export default Secrets
