import React, { useMemo, useState } from 'react'
import { Card, Space, Switch } from 'antd'
import { Chart, Interval } from 'bizcharts'
import EmptyInfo from './empty'
import { useLibs } from '../store'
import { useLibInfos } from '../api'
import moment from 'moment'

export default () => {
  const [onlyStable, setOnlyStable] = useState(true)
  const libs = useLibs()
  const { data: libInfos, error, isValidating } = useLibInfos(libs)
  const releaseData = useMemo(() => {
    if (!libInfos) {
      return []
    }

    return libs.reduce((r, lib) => {
      const info = libInfos[lib]
      if (info) {
        return r.concat(info.versions.map(v => {
          const date = moment(v.published_at)
          return {
            version: v.number,
            name: lib,
            date: date.format('YYYY-MM-DD'),
            year: date.format('YYYY'),
            month: `2020-${date.format('MM-DD HH:mm:ss')}`,
          }
        }))
      }
      return r
    }, [] as any[]).sort((a, b) => a.date > b.date ? 1 : -1)
  }, [libInfos, libs])

  const stableReleaseData = useMemo(() => {
    return releaseData.filter(d => !d.version.includes('-'))
  }, [releaseData])

  return (
    <Card
      title='NPM Release'
      extra={(
        <Space>
          <Switch
           checked={onlyStable}
           onChange={setOnlyStable}
           size='small'
          />
          <span>
            Only Stable
          </span>
        </Space>
      )}
    >
      <Chart
        autoFit
        height={300}
        data={onlyStable ? stableReleaseData : releaseData}
        scale={{
          month: {
            type: 'time',
            values: ['2020-01-01', '2021-01-01'],
            ticks: ['2020-03-01', '2020-06-01', '2020-09-01', '2020-12-01'],
            formatter: (d: string) => moment(d).format('MMM'),
          },
          year: {
            type: 'cat',
          }
        }}
      >
        <Interval
          adjust={[
          {
              type: 'dodge',
              marginRatio: 0,
            },
          ]}
          color='name'
          position='year*month'
          shape='tick'
          size={12}
          tooltip={[
            'name*version*date',
            (name, version, date) => ({
              name,
              title: date,
              value: version,
            })
          ]}
        />
        {libInfos ? null : (
          <EmptyInfo>
            {error || isValidating ? 'loading...' : 'No Data'}
          </EmptyInfo>
        )}
      </Chart>
    </Card>
  )
}