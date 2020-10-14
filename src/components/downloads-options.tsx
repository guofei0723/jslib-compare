import React from 'react'
import { DatePicker, Divider, Space, Switch } from 'antd'
import moment from 'moment'

export type Range = [moment.Moment | null, moment.Moment | null]
interface OptionsProps {
  range: Range | null
  onRangeChange: (range: Range | null, rangeStr: [string, string]) => void

  /**
   * 是否排除周末
   */
  excludeWeekends: boolean
  onExcludeChange: (exclude: boolean) => void
}

export default ({
  range,
  onRangeChange,
  excludeWeekends,
  onExcludeChange,
}: OptionsProps) => {
  return (
    <div>
      <Space>
        <DatePicker.RangePicker
          ranges={{
            'last-week': () => [moment().subtract(1, 'week'), moment().subtract(1, 'day')],
            'last-month': () => [moment().subtract(1, 'month'), moment().subtract(1, 'day')],
            'last-year': () => [moment().subtract(1, 'year'), moment().subtract(1, 'day')],
          }}
          disabledDate={(cur) => {
            const now = moment()
            return now.subtract(1, 'day').diff(cur, 'year') >= 1 || now.diff(cur, 'day') <= 0
          }}
          value={range}
          onChange={onRangeChange}
          size='small'
        />
        <Divider type='vertical' style={{ height: '1.3em'}} />
        <Switch size='small' checked={excludeWeekends} onChange={onExcludeChange} />
        <span>exclude weekends</span>
      </Space>
    </div>
  )
}