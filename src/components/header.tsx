import React, { useState, useCallback } from 'react'
import { PageHeader, Space, Input, Tag, Button } from 'antd'

interface Props {
  libsInComparison: string[]
  onCompare: (libs: string[]) => void
}

export default ({ libsInComparison, onCompare }: Props) => {
  const [libs, setLibs] = useState<string[]>(libsInComparison)
  const [newLib, setNewLib] = useState<string>('')

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
          onClick={() => onCompare(libs)}
          disabled={libs === libsInComparison || libs.length === 0}
        >
          Compare
        </Button>
      </Space>
    </PageHeader>
  )
}
