import React from 'react'
import { DatePicker, Divider, Radio, Space, Switch } from 'antd'
import moment from 'moment'

export type Range = [moment.Moment | null, moment.Moment | null]
export type TimeType = 'daily' | 'weekly'

interface OptionsProps {
  range: Range | null
  onRangeChange: (range: Range | null, rangeStr: [string, string]) => void

  timeType: TimeType
  onTimeTypeChange: (timeType: TimeType) => void

  /**
   * 是否排除周末
   */
  excludeWeekends: boolean
  onExcludeChange: (exclude: boolean) => void
}

export default ({
  range,
  onRangeChange,
  timeType,
  onTimeTypeChange,
  excludeWeekends,
  onExcludeChange,
}: OptionsProps) => {
  return (
    <div>
      <Space>
        <Radio.Group value={timeType} onChange={(e) => onTimeTypeChange(e.target.value)}>
          <Radio value='weekly'>weekly</Radio>
          <Radio value='daily'>daily</Radio>
        </Radio.Group>
        <Switch size='small' checked={excludeWeekends} onChange={onExcludeChange} disabled={timeType === 'weekly'} />
        <span>exclude weekends</span>
        <Divider type='vertical' style={{ height: '1.3em'}} />
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
      </Space>
    </div>
  )
}