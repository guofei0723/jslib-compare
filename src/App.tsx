import React from 'react'
import { Layout, Space } from 'antd'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { SWRConfig } from 'swr'
import './App.less'
import { DownloadsChart, ReleaseChart, TheHeader } from './components'
import { LibsProvider } from './store'

const { Content } = Layout

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className='App'>
        <Layout style={{ minHeight: '100%' }}>
          <Content>
            <Switch>
              <Route path='/'>
                <SWRConfig
                  value={{
                    revalidateOnFocus: false,
                    shouldRetryOnError: false,
                  }}
                >
                  <LibsProvider>
                    <TheHeader />
                    <Space direction='vertical' style={{ display: 'flex', padding: '0 24px'}} size='large'>
                      <DownloadsChart />
                      <ReleaseChart />
                    </Space>
                  </LibsProvider>
                </SWRConfig>
              </Route>
            </Switch>
          </Content>
        </Layout>
      </div>
    </Router>
  );
}

export default App
