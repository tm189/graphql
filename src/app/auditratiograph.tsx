"use client";
import { useEffect, useState } from "react";

interface AuditData {
  auditsDone: number;
  auditsReceived: number;
  ratio: number;
  login: string;
}

export default function AuditRatioGraph({ token }: { token: string }) {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const query = `{
          user {
            id
            login
            auditRatio
            audits {
              id
            }
            audited {
              id
            }
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

        console.log("Full response:", data);

        const user = data.data?.user[0];
        const auditsDone = user?.audits?.length || 0;
        const auditsReceived = user?.audited?.length || 0;

        console.log(
          "Audits Done:",
          auditsDone,
          "Audits Received:",
          auditsReceived
        );

        setAuditData({
          auditsDone,
          auditsReceived,
          ratio: user?.auditRatio || 0,
          login: user?.login || "User",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching audit data:", error);
        setLoading(false);
      }
    };

    if (token) {
      fetchAuditData();
    }
  }, [token]);

  if (loading) return <div>Loading audit data...</div>;
  if (!auditData) return <div>No audit data found</div>;

  const width = 600;
  const height = 400;
  const padding = 50;
  const barWidth = 100;
  const spacing = 50;
  const maxValue = Math.max(auditData.auditsDone, auditData.auditsReceived, 1);
  const graphHeight = height - 2 * padding;

  const doneHeight = (auditData.auditsDone / maxValue) * graphHeight;
  const receivedHeight = (auditData.auditsReceived / maxValue) * graphHeight;

  const doneX = padding + 50;
  const receivedX = doneX + barWidth + spacing;

  return (
    <div
      style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc" }}
    >
      <h2>Audit Ratio - {auditData.login}</h2>
      <svg width={width} height={height} style={{ border: "1px solid #ddd" }}>
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#000"
          strokeWidth={2}
        />

        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#000"
          strokeWidth={2}
        />

        <text
          x={20}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90 20 ${height / 2})`}
          fontSize={14}
          fontWeight="bold"
        >
          Count
        </text>

        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
        >
          Audit Type
        </text>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={`grid-${ratio}`}
            x1={padding}
            y1={height - padding - graphHeight * ratio}
            x2={width - padding}
            y2={height - padding - graphHeight * ratio}
            stroke="#e0e0e0"
            strokeWidth={1}
            strokeDasharray="5,5"
          />
        ))}

        <rect
          x={doneX - barWidth / 2}
          y={height - padding - doneHeight}
          width={barWidth}
          height={doneHeight}
          fill="#2196F3"
          opacity={0.8}
        />

        <rect
          x={receivedX - barWidth / 2}
          y={height - padding - receivedHeight}
          width={barWidth}
          height={receivedHeight}
          fill="#FF9800"
          opacity={0.8}
        />

        <text
          x={doneX}
          y={height - padding + 25}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
        >
          Audits Done
        </text>
        <text
          x={doneX}
          y={height - padding - doneHeight - 10}
          textAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          fill="#2196F3"
        >
          {auditData.auditsDone}
        </text>

        <text
          x={receivedX}
          y={height - padding + 25}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
        >
          Audits Received
        </text>
        <text
          x={receivedX}
          y={height - padding - receivedHeight - 10}
          textAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          fill="#FF9800"
        >
          {auditData.auditsReceived}
        </text>
      </svg>

      <div style={{ marginTop: "20px", fontSize: "14px" }}>
        <p>
          <strong>Total Audits Done:</strong> {auditData.auditsDone}
        </p>
        <p>
          <strong>Total Audits Received:</strong> {auditData.auditsReceived}
        </p>
        <p>
          <strong>Audit Ratio:</strong> {auditData.ratio.toFixed(2)}
        </p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          (Ratio = Audits Done / Audits Received)
        </p>
      </div>
    </div>
  );
}
