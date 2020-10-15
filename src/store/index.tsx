import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const LibsContext = React.createContext<string[]>([])

const queryReg = /^\?libs=(.+)$/

export const LibsProvider: React.FC = ({ children}) => {
  const [libs, setLibs] = useState<string[]>([])
  const { search } = useLocation()
  
  useEffect(() => {
    const query = decodeURIComponent(search).match(queryReg)
    setLibs(query ? query[1].split(',') : [])
  }, [search])

  return (
    <LibsContext.Provider value={libs}>
      {children}
    </LibsContext.Provider>
  )
}

export const useLibs = () => useContext(LibsContext)