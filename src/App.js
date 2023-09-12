import './App.css'

import Credential from './components/Credential'
import { Menu, Button } from 'antd'
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
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
