import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import RealTimeVisualizer from "../Component/RealTimeVisualizer";
import Metrics from "../Component/Metrics";
import Prediction from "../Component/Prediction";

function Dashboard() {
  const [beatsPerMinute, setBeatsPerMinute] = useState([]);
  const [beatAvg, setBeatAvg] = useState([]);
  const [SpO2, setSpO2] = useState([]);
  const [bodyTemperature, setBodyTemperature] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://54.83.118.12:8000/ws");

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received WebSocket message:", message);

      if (message.SensorData) {
        const data = message.SensorData;
        console.log("SensorData:", data);

        setBeatsPerMinute((prevData) => [...prevData, data.beatsPerMinute]);
        setBeatAvg((prevData) => [...prevData, data.beatAvg]);
        setSpO2((prevData) => [...prevData, data.SpO2]);
        setBodyTemperature((prevData) => [...prevData, data.bodyTemperature]);
      } else {
        console.warn("Received unrecognized message format:", message);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const VisualizerData = [
    { title: "Beats Per Minute :", data: beatsPerMinute },
    { title: "Beat Average :", data: beatAvg },
    { title: "SpO2 Levels :", data: SpO2 },
    { title: "Body Temperature :", data: bodyTemperature },
  ];

  return (
    <div className="dashboard">
      <Header />

      <div className="gaps wide-card">
        {VisualizerData.map((item, index) => (
          <RealTimeVisualizer key={index} title={item.title} chartData={item.data} />
        ))}
      </div>

      <div className="prediction">
        <h2 style={{ fontSize: "1.8rem" }}>The Results are listed below:</h2>
        <Metrics />
        <Prediction />
      </div>
    </div>
  );
}

export default Dashboard;
