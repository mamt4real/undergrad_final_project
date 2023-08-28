import React, { PureComponent } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default class ChartBar extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r'

  render() {
    const { title, data, datakeys, grid = true } = this.props
    return (
      <div className='chart barchat'>
        <h3 className='chart__title'>{title}</h3>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {grid && <CartesianGrid strokeDasharray='3 3' />}
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)' }} />
            {/* <Legend /> */}
            {datakeys.map((datakey, i) => (
              <Bar dataKey={datakey} key={i} fill={COLORS[i % COLORS.length]} />
            ))}
            {/* <Bar dataKey='amt' fill='#82ca9d' /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
}
