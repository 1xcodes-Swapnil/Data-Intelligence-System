import { PriceData } from '@/types/agent';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PriceChartProps {
  priceHistory: PriceData[];
  currentPrice: number;
}

export function PriceChart({ priceHistory, currentPrice }: PriceChartProps) {
  const chartData = priceHistory.map((data, index) => ({
    time: index,
    price: data.price,
    predicted: data.predicted,
    confidenceLow: data.confidenceLow,
    confidenceHigh: data.confidenceHigh
  }));

  const minPrice = Math.min(...priceHistory.map(d => d.confidenceLow || d.price)) - 0.5;
  const maxPrice = Math.max(...priceHistory.map(d => d.confidenceHigh || d.price)) + 0.5;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Price History & Predictions
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-cyan-500 to-cyan-400" />
            <span className="text-slate-400">Actual</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-violet-500 to-violet-400" />
            <span className="text-slate-400">Predicted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-fuchsia-500/30" />
            <span className="text-slate-400">Confidence</span>
          </div>
        </div>
      </div>

      <div className="h-[250px]">
        {chartData.length > 2 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#475569" 
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis 
                domain={[minPrice, maxPrice]}
                stroke="#475569"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              />
              <ReferenceLine 
                y={currentPrice} 
                stroke="#06b6d4" 
                strokeDasharray="3 3" 
                strokeOpacity={0.5}
              />
              {/* Confidence band */}
              <Area
                type="monotone"
                dataKey="confidenceHigh"
                stroke="transparent"
                fill="url(#confidenceGradient)"
              />
              <Area
                type="monotone"
                dataKey="confidenceLow"
                stroke="transparent"
                fill="#0f172a"
              />
              {/* Predicted line */}
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#predictedGradient)"
                strokeDasharray="5 5"
              />
              {/* Actual price line */}
              <Area
                type="monotone"
                dataKey="price"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div>Collecting price data...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
