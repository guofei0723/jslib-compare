import React, { useMemo } from 'react'
import { Card } from 'antd'
import { Axis, Chart, LineAdvance } from 'bizcharts'
import numeral from 'numeral'
import { useNpmRangeData } from '../api'

interface DataItem {
  downloads: number
  day: string
  lib: string
}

export default ({ libs }: { libs: string[]}) => {
  const { data: downloads } = useNpmRangeData('last-month', ...libs)

  const data = useMemo(() => {
    if (!downloads) {
      return []
    }
    
    const dd = libs.reduce<DataItem[]>((r, n) => {
      const packageDownloads = downloads.data[n]
      if (packageDownloads) {
        return r.concat(packageDownloads.downloads.map(
          (dl) => ({ ...dl, lib: n })
        ))
      }

      return r
    }, [])

    return dd
  }, [downloads, libs])

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
