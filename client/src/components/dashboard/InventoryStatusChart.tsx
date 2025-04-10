import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface InventoryStatusChartProps {
  data?: CategoryData[];
  loading?: boolean;
}

export default function InventoryStatusChart({ data, loading = false }: InventoryStatusChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || loading) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Default data if none provided
    const chartData = data || [
      { name: 'Electronics', value: 52, color: 'hsl(217, 91%, 60%)' },
      { name: 'Clothing', value: 28, color: 'hsl(35, 92%, 50%)' },
      { name: 'Home Goods', value: 20, color: 'hsl(142, 71%, 45%)' }
    ];

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: chartData.map(item => item.name),
        datasets: [
          {
            data: chartData.map(item => item.value),
            backgroundColor: chartData.map(item => item.color),
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((context.parsed * 100) / total);
                return `${context.label}: ${percentage}% (${context.parsed} items)`;
              }
            }
          }
        },
        cutout: '65%',
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, loading]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded animate-pulse">
        <div className="text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  const categories = data || [
    { name: 'Electronics', value: 52, color: 'hsl(217, 91%, 60%)' },
    { name: 'Clothing', value: 28, color: 'hsl(35, 92%, 50%)' },
    { name: 'Home Goods', value: 20, color: 'hsl(142, 71%, 45%)' }
  ];

  return (
    <>
      <div className="chart-container w-full h-[250px]">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: category.color }}
            ></span>
            <span className="text-sm text-gray-600">{category.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}
