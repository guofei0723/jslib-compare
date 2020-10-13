import React, { useEffect } from 'react'
import { useNpmRangeData } from '../api'

export default () => {
  const { data } = useNpmRangeData('last-week', 'react', 'nothispackge')

  useEffect(() => {
    if (data) {
      console.log('npm downloads:', data)
    }
  }, [data])

  return (
    <section>
      <header>
        react downloads - npm
      </header>
      <p>
        {!data ? 'loading' : 'see console, also'}
      </p>
    </section>
  )
}