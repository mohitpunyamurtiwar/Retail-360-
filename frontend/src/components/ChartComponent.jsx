import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function ChartComponent() {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Sales ₹',
        data: [12000, 19000, 15000, 22000, 28000],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(16, 185, 129, 1)',
        ],
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString()
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  }

  return (
    <div className="h-80">
      <Bar options={options} data={data} />
    </div>
  )
}

