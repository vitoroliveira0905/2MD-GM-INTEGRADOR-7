"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function GraficoPro({
  titulo,
  labels = [],
  valores = [],
  tipo = "bar",
  cores = [],
  altura = 400,
  mostrarLegenda = true,
  mostrarGrid = true
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);


  const coresPadrao = [
    "rgba(74, 144, 226, 0.65)",
    "rgba(255, 99, 132, 0.65)",
    "rgba(255, 206, 86, 0.65)",
    "rgba(46, 204, 113, 0.65)",
    "rgba(155, 89, 182, 0.65)",
    "rgba(241, 196, 15, 0.65)"
  ];

  const coresHover = coresPadrao.map(c => c.replace("0.65", "0.9"));

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destruir gráfico anterior
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: tipo,
      data: {
        labels,
        datasets: [
          {
            label: titulo,
            data: valores,
            backgroundColor: cores.length ? cores : coresPadrao,
            borderColor: "#1f1f1f22",
            borderWidth: 2,
            hoverBackgroundColor: cores.length ? cores : coresHover,
            borderRadius: tipo === "bar" ? 8 : 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
          easing: "easeOutQuart"
        },
        plugins: {
          legend: {
            display: mostrarLegenda,
            position: "top",
            labels: {
              font: { size: 14, weight: "600" },
              color: "#333"
            }
          },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
            backgroundColor: "#333",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10
          }
        },
        scales:
          tipo === "bar"
            ? {
                y: {
                  beginAtZero: true,
                  ticks: { color: "#555", font: { size: 13 } },
                  grid: { display: mostrarGrid, color: "#eaeaea" }
                },
                x: {
                  ticks: { color: "#555", font: { size: 13 } },
                  grid: { display: false }
                }
              }
            : {}
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [labels, valores, tipo, cores, mostrarLegenda, mostrarGrid, titulo]);

  return (
    <div
      className="shadow-sm p-4 rounded-4 bg-white"
      style={{
        height: altura,
        borderRadius: "20px",
        border: "1px solid #e4e4e4",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h5 className="fw-semibold mb-3 text-center">{titulo}</h5>
      <div style={{ flex: 1 }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
