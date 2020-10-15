import React from 'react'
import { Layout, Space } from 'antd'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import './App.less'
import { DownloadsChart, TheHeader } from './components'
import { LibsProvider } from './store'

const { Content } = Layout

function App() {
  return (
    <Router>
      <div className='App'>
        <Layout>
          <Content>
            <Switch>
              <Route path='/'>
                <LibsProvider>
                  <TheHeader />
                  <Space direction='vertical' style={{ display: 'flex', padding: '0 24px'}} size='large'>
                    <DownloadsChart />
                  </Space>
                </LibsProvider>
              </Route>
            </Switch>
          </Content>
        </Layout>
      </div>
    </Router>
  );
}

export default App
