import React, { useState, useMemo } from 'react'
import { Card, Empty } from 'antd'
import { Axis, Chart, LineAdvance } from 'bizcharts'
import numeral from 'numeral'
import moment from 'moment'
import { useNpmRangeData } from '../api'
import Options, { Range } from './downloads-options'


interface DataItem {
  downloads: number
  day: string
  lib: string
}

const lastYear = [moment().subtract(1, 'year'), moment().subtract(1, 'day')]
const lastYearStr = lastYear.map(r => r.format('YYYY-MM-DD')).join(':')

export default ({ libs }: { libs: string[]}) => {
  const [dateRange, setDateRange] = useState<Range | null>(lastYear as Range)
  const [rangeStr, setRangeStr] = useState(lastYearStr)
  const [excludeWeekends, setExcludeWeekends] = useState(true)
  const { data: downloads } = useNpmRangeData(rangeStr || lastYearStr, ...libs)

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

  // 排除掉周末的数据
  const dataWithoutWeekends = useMemo(() => {
    return data.filter(({ day }) => moment(day).isoWeekday() < 6)
  }, [data])

  return (
    <Card
      title='Downloads'
      extra={(
        <Options
          range={dateRange}
          onRangeChange={(range, rangeStrs) => {
            setDateRange(range)
            setRangeStr(range ? rangeStrs.join(':') : '')
          }}
          excludeWeekends={excludeWeekends}
          onExcludeChange={setExcludeWeekends}
        />
      )}
    >
      <Chart
        padding={[10, 50, 50]}
        height={300}
        autoFit
        data={excludeWeekends ? dataWithoutWeekends : data}
      >
        <Axis
          name='downloads'
          label={{
            formatter: (text) => `${numeral(text).divide(1000).value()}K`
          }}
        />
        <LineAdvance
          shape='smooth'
          area
          position='day*downloads'
          color='lib'
          tooltip={['lib*downloads', (name, dls) => ({ name, value: numeral(dls).format('0,0') })]}
        />
        {downloads ? null : (
          <Empty
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </Chart>
    </Card>
  )
}
