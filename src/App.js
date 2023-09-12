import './App.css'

import Credential from './components/Credential'
import Secrets from './components/Secrets'
import { Menu } from 'antd'
import { InfoCircleOutlined, KeyOutlined } from '@ant-design/icons'

const items = [
  {
    label: 'API Keys',
    key: 'keys',
    icon: <KeyOutlined />,
  },
  {
    label: 'Information',
    key: 'info',
    icon: <InfoCircleOutlined />,
    disabled: true,
  },
]

function App() {
  return (
    <div>
      <header>
        <nav>
          <Menu
            selectedKeys={['keys']}
            mode='horizontal'
            items={items}
          />
        </nav>
      </header>

      <main>
        <Credential />
        <Secrets />
      </main>
    </div>
  )
}

export default App
