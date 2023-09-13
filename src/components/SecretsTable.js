import { Table } from 'antd'

const linesPerPage = 5

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

const SecretsTable = (props) => {
  const { secrets } = props

  return (
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
  )
}

export default SecretsTable
