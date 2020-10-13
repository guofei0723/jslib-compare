import React, { useEffect, useState } from 'react'
import { useRepoData } from '../api'

export default () => {
  const [counter, setCounter] = useState(0)
  // 加载
  // const { data } = useSWR([param], (p) => octokit.repos.get(p))
  const { data } = useRepoData('facebook', 'react')

  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data])

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>
    const update = () => {
      timerId = setTimeout(update, 1000)
      setCounter(c => c + 1)
    }

    update()

    return () => clearTimeout(timerId)
  }, [])

  return (
    <div>
      <h3>
        update times: {counter}
      </h3>
      <h3>
        {!data ? 'loading...' : 'see console'}
      </h3>
    </div>
  )
}