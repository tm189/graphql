"use client";
import { useEffect, useState } from "react";

export default function XPGraph({ token }: { token: string }) {
  const [transactions, setTransactions] = useState<
    Array<{ id: string; amount: number; createdAt: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXPData = async () => {
      try {
        const query = `{
          transaction(where: { type: { _eq: "xp" } }, order_by: { createdAt: asc }) {
            id
            amount
            createdAt
          }
        }`;

        const response = await fetch(
          "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query }),
          }
        );

        const data = await response.json();
        setTransactions(data.data.transaction);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching XP data:", error);
        setLoading(false);
      }
    };

    if (token) {
      fetchXPData();
    }
  }, [token]);

  if (loading) return <div>Loading graph...</div>;

  // Calculate cumulative XP
  const dataPoints = transactions.reduce((acc, tx, idx) => {
    const cumulativeXP = (acc[idx - 1]?.xp || 0) + tx.amount;
    acc.push({
      date: new Date(tx.createdAt).toLocaleDateString(),
      xp: cumulativeXP,
    });
    return acc;
  }, [] as Array<{ date: string; xp: number }>);

  const cumulativeXP = dataPoints[dataPoints.length - 1]?.xp || 0;
  // SVG dimensions
  const width = 800;
  const height = 400;
  const padding = 50;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // Calculate scale
  const maxXP = Math.max(...dataPoints.map((d) => d.xp));
  const xScale = graphWidth / (dataPoints.length - 1 || 1);
  const yScale = graphHeight / maxXP;

  // Generate SVG path
  const pathData = dataPoints
    .map(
      (point, idx) =>
        `${idx === 0 ? "M" : "L"} ${padding + idx * xScale} ${
          height - padding - point.xp * yScale
        }`
    )
    .join(" ");

  return (
    <div
      style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc" }}
    >
      <h2>XP Progress Over Time</h2>
      <svg width={width} height={height} style={{ border: "1px solid #ddd" }}>
        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#000"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#000"
          strokeWidth="2"
        />

        {/* Y-axis label */}
        <text
          x={20}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90 20 ${height / 2})`}
          fontSize="14"
        >
          XP
        </text>

        {/* X-axis label */}
        <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="14">
          Time
        </text>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={`grid-${ratio}`}
            x1={padding}
            y1={height - padding - graphHeight * ratio}
            x2={width - padding}
            y2={height - padding - graphHeight * ratio}
            stroke="#e0e0e0"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        ))}

        {/* Data line */}
        <path
          d={pathData}
          fill="none"
          stroke="#4CAF50"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((point, idx) => (
          <circle
            key={idx}
            cx={padding + idx * xScale}
            cy={height - padding - point.xp * yScale}
            r="5"
            fill="#4CAF50"
          />
        ))}
      </svg>

      {/* Legend */}
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
        Total XP: <strong>{cumulativeXP}</strong>
      </div>
    </div>
  );
}
