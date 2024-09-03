import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components you need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function RealTimeVisualizer({ title, chartData }) {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        fill: true,
        backgroundColor: "rgba(255, 0, 0, 0.8)", // Red background color for the line
        borderColor: "rgba(255, 0, 0, 0.8)", // Red border color for the line
        borderWidth: 2,
        tension: 0.1, // Slightly jagged line
      },
    ],
  });

  useEffect(() => {
    // Update chart data when chartData prop changes
    setData((prevState) => {
      const newLabels = [...prevState.labels];
      const newData = [...prevState.datasets[0].data];

      // Add new data point and maintain only the latest 50 points
      newLabels.push(newLabels.length + 1); // Add label
      newData.push(chartData[chartData.length - 1]); // Add new data point

      if (newLabels.length > 50) {
        newLabels.shift(); // Remove oldest label
        newData.shift(); // Remove oldest data point
      }

      return {
        labels: newLabels,
        datasets: [
          {
            ...prevState.datasets[0],
            data: newData,
          },
        ],
      };
    });
  }, [chartData]); // Trigger update when chartData changes

  return (
    <div
      style={{
        width: "55dvw",
        backgroundColor: "#0f3460", // Deep blue card background
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 6px 12px rgba(0, 229, 255, 0.3)", // Neon Cyan Glow
        transition: "transform 0.4s, box-shadow 0.4s", // Match the global transition duration
      }}
      className="visualizer-card" // Add class name for potential further styling
    >
      <h2
        style={{
          color: "#e0e0e0", // Light gray text color
          textShadow: "0 0 5px #00e5ff, 0 0 10px #00e5ff", // Glowing text effect
        }}
      >
        {title}
      </h2>
      <Line
        data={data}
        options={{
          responsive: true,
          scales: {
            x: {
              display: false, // Hide x-axis labels
            },
            y: {
              display: true,
              ticks: {
                color: "#e0e0e0", // Light gray Y-axis labels color for contrast
              },
              min: 0,
              max: 120,
            },
          },
          plugins: {
            legend: {
              display: false, // Hide legend
            },
          },
        }}
      />
    </div>
  );
}

export default RealTimeVisualizer;
