import React, { useState, useMemo } from 'react'
import { Card, Empty } from 'antd'
import { Axis, Chart, LineAdvance } from 'bizcharts'
import numeral from 'numeral'
import moment from 'moment'
import { useNpmRangeData } from '../api'
import Options, { Range, TimeType } from './downloads-options'
import { useLibs } from '../store'


interface DataItem {
  downloads: number
  day: string
  lib: string
  duration?: string
}

const lastYear = [moment().subtract(1, 'year'), moment().subtract(1, 'day')]
const lastYearStr = lastYear.map(r => r.format('YYYY-MM-DD')).join(':')

export default () => {
  const libs = useLibs()
  const [dateRange, setDateRange] = useState<Range | null>(lastYear as Range)
  const [rangeStr, setRangeStr] = useState(lastYearStr)
  const [timeType, setTimeType] = useState<TimeType>('weekly')
  const [excludeWeekends, setExcludeWeekends] = useState(true)
  const { data: downloads, error, isValidating } = useNpmRangeData(rangeStr || lastYearStr, ...libs)

  const data = useMemo(() => {
    if (!downloads) {
      return []
    }
    
    const dd = libs.reduce<DataItem[]>((r, n) => {
      const packageDownloads = downloads[n]
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

  // 按周汇总的数据
  const dataWeekly = useMemo(() => {
    if (!downloads) {
      return []
    }

    return libs.reduceRight<DataItem[]>((result, lib) => {
      const libDownloads = downloads[lib]?.downloads || []
      
      let lastDay: moment.Moment | null = null
      let item: DataItem = {
        downloads: 0,
        lib,
        day: '',
      }

      for(let i = libDownloads.length - 1; i >= 0; i--) {
        const ld = libDownloads[i]
        const day = moment(ld.day)
        if (!lastDay) {
          lastDay = moment(ld.day)
        }

        const diffDay = lastDay.diff(day, 'day')
        if (diffDay <= 6) {
          item.downloads += ld.downloads
        }
        // 第七天 保存数据
        if (diffDay === 6) {
          item.duration = `${day.format('YYYY-MM-DD')} to ${lastDay.format('YYYY-MM-DD')}`
          item.day = lastDay.format('YYYY-MM-DD')
          result.unshift(item)

          // 初始化下一个七天
          lastDay = null
          item = {
            day: '',
            downloads: 0,
            lib,
          }
        }
      }

      return result
    }, [])
  }, [downloads, libs])

  return (
    <Card
      title='NPM Downloads'
      extra={(
        <Options
          range={dateRange}
          onRangeChange={(range, rangeStrs) => {
            setDateRange(range)
            setRangeStr(range ? rangeStrs.join(':') : '')
          }}
          timeType={timeType}
          onTimeTypeChange={setTimeType}
          excludeWeekends={excludeWeekends}
          onExcludeChange={setExcludeWeekends}
        />
      )}
    >
      <Chart
        padding={[10, 50, 50]}
        height={300}
        autoFit
        data={timeType === 'weekly' ? dataWeekly : excludeWeekends ? dataWithoutWeekends : data}
        scale={{
          downloads: {
            min: 0,
          }
        }}
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
          tooltip={[
            'lib*downloads*duration*day',
            (name, dls, duration, day) => ({
              name,
              value: numeral(dls).format('0,0'),
              title: duration || day
            })
          ]}
        />
        {downloads ? null : (
          <Empty
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            description={error || isValidating ? 'loading...' : 'No Data'}
          />
        )}
      </Chart>
    </Card>
  )
}
