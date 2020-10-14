import { Layout, Space } from 'antd';
import React, { useState } from 'react'
import './App.less'
import { DownloadsChart, TheHeader } from './components'

const { Content } = Layout

function App() {
  const [libsInComparison, setLibsInComparison] = useState<string[]>([])

  return (
    <div className="App">
      <Layout>
        <Content>
          <TheHeader libsInComparison={libsInComparison} onCompare={setLibsInComparison} />
          <Space direction='vertical' style={{ display: 'flex', padding: '0 24px'}} size='large'>
            <DownloadsChart libs={libsInComparison} />
            <div>next</div>
            <h2>next again</h2>
          </Space>
        </Content>
      </Layout>
    </div>
  );
}

export default App
