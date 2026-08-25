import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ProductOpportunity } from '../../types/analytics';

const BAR_COLORS = ['#0e756e', '#328e72', '#5a9bb7', '#9279b8', '#dda04a'];

export function ProductOpportunitySection({ opportunities }: { opportunities: ProductOpportunity[] }) {
  return (
    <section className="dashboard-panel analytics-section" id="product-opportunity">
      <div className="panel-heading">
        <div>
          <p>AI product opportunity</p>
          <h2>Highest potential demand</h2>
        </div>
        <span className="panel-caption">AI-identified opportunities, not guaranteed eligibility</span>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={opportunities} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid horizontal={false} stroke="#edf0f4" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#8b96a6', fontSize: 10 }} />
          <YAxis type="category" dataKey="product" axisLine={false} tickLine={false} width={140} tick={{ fill: '#42506a', fontSize: 10.5 }} />
          <Tooltip formatter={(value) => `${Number(value).toLocaleString('en-IN')} potential customers`} cursor={{ fill: '#f5f8fa' }} />
          <Bar dataKey="potentialCustomers" radius={[0, 4, 4, 0]} barSize={18}>
            {opportunities.map((item, index) => <Cell key={item.product} fill={BAR_COLORS[index % BAR_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="analytics-opportunity-grid">
        {opportunities.map((item) => (
          <div className="analytics-opportunity-card" key={item.product}>
            <strong>{item.product}</strong>
            <span>{item.potentialCustomers.toLocaleString('en-IN')} potential customers</span>
            <div className="analytics-opportunity-meta">
              <span>Confidence <b>{item.avgConfidence}%</b></span>
              <span>Conversion potential <b>{item.conversionPotential}%</b></span>
            </div>
            <small>{item.segment}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
