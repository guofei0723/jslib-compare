import React, { useState, useCallback, useEffect } from 'react'
import { PageHeader, Space, Input, Tag, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { useLibs } from '../store'

export default () => {
  const history = useHistory()
  const libsInUrl = useLibs()
  const [libs, setLibs] = useState<string[]>(libsInUrl)
  const [newLib, setNewLib] = useState<string>('')

  useEffect(() => {
    setLibs(prevLibs => {
      if (prevLibs.join(',') !== libsInUrl.join(',')) {
        return libsInUrl
      }

      return prevLibs
    })
  }, [libsInUrl])

  const addNewLib = useCallback(() => {
    if (newLib) {
      setLibs(libs => {
        if (libs.includes(newLib)) {
          return libs
        }

        return libs.concat(newLib)
      })
      setNewLib('')
    }
  }, [newLib])

  return (
    <PageHeader
      title='JS Compare'
      backIcon={false}
    >
      <Space direction='vertical'>
        <div style={{ display: 'inline-block' }}>
          {libs.map(lib => (
            <Tag
              key={lib}
              closable
              onClose={() => setLibs(libs.filter(l => l !== lib))}
            >
              {lib}
            </Tag>
          ))}
          <Space>
            <Input
              size='small'
              type='text'
              value={newLib}
              onPressEnter={addNewLib}
              onChange={(e) => setNewLib(e.target.value)}
              style={{
                width: '160px',
              }}
              placeholder='add js library'
              addonAfter={(
                <Button
                  type='text'
                  size='small'
                  onClick={addNewLib}
                  disabled={!newLib}
                  style={{
                    height: 22,
                    border: 0,
                    padding: 0,
                  }}
                >
                  +
                </Button>
              )}
            />
            <Button
              size='small'
              danger
              onClick={() => setLibs([])}
              disabled={libs.length === 0}
            >
              clear
            </Button>
          </Space>
        </div>
        <Button
          type='primary'
          onClick={() => history.push(`/?libs=${libs.join(',')}`)}
          disabled={libs === libsInUrl || libs.length === 0}
        >
          Compare
        </Button>
      </Space>
    </PageHeader>
  )
}
