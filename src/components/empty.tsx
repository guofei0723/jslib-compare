import React from 'react'
import { Empty } from 'antd'

const EmptyInfo: React.FC = ({ children }) => {
  return (
    <Empty
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      description={children}
    />
  )
}

export default EmptyInfo
