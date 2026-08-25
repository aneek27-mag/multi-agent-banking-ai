import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DigitalAdoptionData } from '../../types/analytics';

export function DigitalAdoptionSection({ data }: { data: DigitalAdoptionData }) {
  return (
    <section className="dashboard-panel analytics-section" id="digital-adoption">
      <div className="panel-heading">
        <div>
          <p>Digital adoption</p>
          <h2>Digital Adoption Score</h2>
        </div>
        <span className="score-chip">{data.score}%</span>
      </div>

      <div className="flow-chart">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data.trend}>
            <CartesianGrid vertical={false} stroke="#edf0f4" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8b96a6', fontSize: 10 }} />
            <YAxis hide domain={[50, 80]} />
            <Tooltip formatter={(value) => `${value}%`} cursor={{ stroke: '#d6e6df' }} />
            <Line type="monotone" dataKey="value" stroke="#0e756e" strokeWidth={2.5} dot={{ r: 3, fill: '#0e756e' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="digital-grid analytics-channel-grid">
        {data.channelUsage.map((item) => (
          <div className="digital-meter" key={item.channel}>
            <div><span>{item.channel}</span><strong>{item.value}%</strong></div>
            <div className="meter-track"><i style={{ width: `${item.value}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="detail-heading analytics-subheading"><div><p>Feature adoption</p></div></div>
      <div className="digital-grid">
        {data.featureAdoption.map((item) => (
          <div className="digital-meter" key={item.feature}>
            <div><span>{item.feature}</span><strong>{item.value}%</strong></div>
            <div className="meter-track"><i style={{ width: `${item.value}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="detail-heading analytics-subheading"><div><p>Monthly active customers</p></div></div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data.monthlyActiveCustomers} barGap={4}>
          <CartesianGrid vertical={false} stroke="#edf0f4" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8b96a6', fontSize: 10 }} />
          <YAxis hide />
          <Tooltip formatter={(value) => Number(value).toLocaleString('en-IN')} cursor={{ fill: '#f5f8fa' }} />
          <Bar dataKey="value" fill="#328e72" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
