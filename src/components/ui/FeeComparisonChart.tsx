import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FeeData {
  broker: string;
  fee: number;
}

interface FeeComparisonChartProps {
  title: string;
  data: FeeData[];
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  metrics: Array<{ value: string; label: string }>;
  yAxisLabel?: string;
  description?: string;
}

const chartConfig = {
  fee: {
    label: 'Fee',
    color: '#3b82f6',
  },
};

export const FeeComparisonChart: React.FC<FeeComparisonChartProps> = ({
  title,
  data,
  selectedMetric,
  onMetricChange,
  metrics,
  yAxisLabel = 'Fee ($)',
  description
}) => {
  const formatTooltipValue = (value: number) => {
    if (value === 0) return 'Free';
    return `$${value.toFixed(2)}`;
  };

  const formatYAxisTick = (value: number) => {
    if (value === 0) return '$0';
    return `$${value}`;
  };

  return (
    <Card className="professional-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-pure-white">{title}</CardTitle>
          <Select value={selectedMetric} onValueChange={onMetricChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {description && (
          <p className="text-sm text-light-grey">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-80">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis 
              dataKey="broker" 
              stroke="#d1d5db"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#d1d5db"
              fontSize={12}
              tickFormatter={formatYAxisTick}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value) => [formatTooltipValue(value as number), yAxisLabel]}
                  labelStyle={{ color: '#ffffff' }}
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #404040',
                    borderRadius: '8px'
                  }}
                />
              }
            />
            <Bar 
              dataKey="fee" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};