import React, { useMemo } from 'react'
import { Card } from 'antd'
import { Axis, Chart, LineAdvance } from 'bizcharts'
import numeral from 'numeral'
import { useNpmRangeData } from '../api'

const compareLibs = ['react', 'vue']
export default () => {
  const { data: downloads } = useNpmRangeData('last-month', ...compareLibs)
  const data = useMemo(() => {
    if (!downloads) {
      return []
    }
    
    const dd = compareLibs.reduce((r, n) => {
      const packageDownloads = downloads.data[n]
      if (packageDownloads) {
        return r.concat(packageDownloads.downloads.map(
          (dl: { downloads: number, day: string }) => ({ ...dl, lib: n })
        ))
      }

      return r
    }, [])

    return dd
  }, [downloads])
  return (
    <Card title='Downloads'>
      <Chart padding={[10, 50, 50]} height={300} autoFit data={data}>
        <Axis
          name='downloads'
          label={{
            formatter: (text) => `${numeral(text).divide(1000).value()}K`
          }}
        />
        <LineAdvance
          position='day*downloads'
          color='lib'
          tooltip={['lib*downloads', (name, dls) => ({ name, value: numeral(dls).format('0,0') })]}
        />
      </Chart>
    </Card>
  )
}
