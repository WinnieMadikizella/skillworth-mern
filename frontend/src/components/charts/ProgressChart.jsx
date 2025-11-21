import React from 'react';
import './ProgressChart.css';

const ProgressChart = ({ 
  title = 'Learning Progress', 
  data = {},
  type = 'line',
  height = 300 
}) => {
  // Default demo data
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Current'],
    datasets: [
      {
        label: 'Technical Skills',
        data: [20, 35, 50, 65, 75, 82, 87],
        color: '#667eea'
      },
      {
        label: 'Project Completion', 
        data: [10, 25, 45, 60, 70, 78, 85],
        color: '#4CAF50'
      },
      {
        label: 'Interview Readiness',
        data: [5, 15, 30, 45, 60, 70, 80],
        color: '#FF9800'
      }
    ],
    ...data
  };

  const maxValue = Math.max(...chartData.datasets.flatMap(d => d.data));

  const renderLineChart = () => (
    <div className="chart-container" style={{ height: `${height}px` }}>
      <div className="chart-grid">
        {/* Y-axis labels */}
        <div className="y-axis">
          {[0, 25, 50, 75, 100].map(value => (
            <div key={value} className="y-label">
              {value}%
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="chart-area">
          {/* Grid lines */}
          <div className="grid-lines">
            {[0, 25, 50, 75, 100].map(value => (
              <div 
                key={value}
                className="grid-line"
                style={{ bottom: `${value}%` }}
              />
            ))}
          </div>

          {/* Data lines */}
          <div className="data-lines">
            {chartData.datasets.map((dataset, index) => (
              <div key={index} className="line-container">
                <svg className="line" viewBox={`0 0 100 ${height}`}>
                  <path
                    d={generateLinePath(dataset.data, height)}
                    stroke={dataset.color}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d={generateAreaPath(dataset.data, height)}
                    fill={`${dataset.color}20`}
                    stroke="none"
                  />
                </svg>
                
                {/* Data points */}
                {dataset.data.map((value, pointIndex) => (
                  <div
                    key={pointIndex}
                    className="data-point"
                    style={{
                      left: `${(pointIndex / (chartData.labels.length - 1)) * 100}%`,
                      bottom: `${(value / maxValue) * 100}%`,
                      backgroundColor: dataset.color
                    }}
                    title={`${value}%`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="x-axis">
            {chartData.labels.map((label, index) => (
              <div key={index} className="x-label">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        {chartData.datasets.map((dataset, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: dataset.color }}
            />
            <span>{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBarChart = () => (
    <div className="chart-container" style={{ height: `${height}px` }}>
      <div className="chart-grid">
        <div className="y-axis">
          {[0, 25, 50, 75, 100].map(value => (
            <div key={value} className="y-label">
              {value}%
            </div>
          ))}
        </div>

        <div className="chart-area">
          <div className="grid-lines">
            {[0, 25, 50, 75, 100].map(value => (
              <div 
                key={value}
                className="grid-line"
                style={{ bottom: `${value}%` }}
              />
            ))}
          </div>

          <div className="bars-container">
            {chartData.datasets[0].data.map((value, index) => (
              <div key={index} className="bar-group">
                <div
                  className="bar"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    backgroundColor: chartData.datasets[0].color
                  }}
                  title={`${value}%`}
                >
                  <span className="bar-value">{value}%</span>
                </div>
                <div className="x-label">{chartData.labels[index]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRadialChart = () => (
    <div className="radial-chart" style={{ height: `${height}px` }}>
      {chartData.datasets.map((dataset, index) => (
        <div key={index} className="radial-item">
          <div 
            className="radial-progress"
            style={{
              background: `conic-gradient(${dataset.color} ${dataset.data[dataset.data.length - 1] * 3.6}deg, #f0f0f0 0deg)`
            }}
          >
            <div className="radial-inner">
              <span className="radial-value">{dataset.data[dataset.data.length - 1]}%</span>
              <span className="radial-label">{dataset.label}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const generateLinePath = (data, chartHeight) => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = chartHeight - (value / maxValue) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const generateAreaPath = (data, chartHeight) => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = chartHeight - (value / maxValue) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} L 100,${chartHeight} L 0,${chartHeight} Z`;
  };

  return (
    <div className="progress-chart">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="chart-actions">
          <button className="chart-btn active">Weekly</button>
          <button className="chart-btn">Monthly</button>
          <button className="chart-btn">All Time</button>
        </div>
      </div>

      {type === 'line' && renderLineChart()}
      {type === 'bar' && renderBarChart()}
      {type === 'radial' && renderRadialChart()}

      <div className="chart-stats">
        <div className="stat">
          <div className="stat-value">87%</div>
          <div className="stat-label">Current Progress</div>
        </div>
        <div className="stat">
          <div className="stat-value">+12%</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat">
          <div className="stat-value">4</div>
          <div className="stat-label">Skills Mastered</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
