"use client";

import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */

interface Transaction {
  id: string;
  type: "up" | "down" | "xp";
  amount: number;
}

interface AuditRatio {
  up: number;
  down: number;
  ratio: number;
}

export default function AuditRatioGraph({ token }: { token: string }) {
  const [data, setData] = useState<AuditRatio | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      const query = `
        query {
          transaction {
            type
            amount
          }
        }
      `;

      const res = await fetch(
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

      const json = await res.json();
      const tx: Transaction[] = json.data.transaction;

      const up = tx
        .filter((t) => t.type === "up")
        .reduce((s, t) => s + t.amount, 0);
      const down = tx
        .filter((t) => t.type === "down")
        .reduce((s, t) => s + t.amount, 0);

      setData({
        up,
        down,
        ratio: down === 0 ? 0 : Number((up / down).toFixed(2)),
      });
    };

    fetchData();
  }, [token]);

  if (!data) return <p>Loading audit data…</p>;

  /* ---------------- CHART MATH ---------------- */

  const total = data.up + data.down;
  const upPct = (data.up / total) * 100;
  const downPct = 100 - upPct;

  const radius = 140;
  const stroke = 36;
  const circumference = 2 * Math.PI * radius;

  const upLength = (upPct / 100) * circumference;
  const downLength = circumference - upLength;

  const polar = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  /* ---------------- LABEL POSITIONS ---------------- */
  const cx = 200;
  const cy = 200;

  const upAngle = (upPct / 100) * 360;
  const downAngle = 360 - upAngle;

  // IMPORTANT: chart starts at -90°
  const startAngle = -90;

  const upLabelAngle = startAngle + upAngle / 2;
  const downLabelAngle = startAngle + upAngle + downAngle / 2;

  const labelRadius = radius - stroke / 2;

  const upLabel = polar(cx, cy, labelRadius, upLabelAngle);
  const downLabel = polar(cx, cy, labelRadius, downLabelAngle);

  /* ---------------- RENDER ---------------- */

  return (
    <div>
      <h2>Audit Ratio Graph</h2>
      <svg width="400" height="400" viewBox="0 0 400 400">
        {/* UP */}
        <circle
          cx="200"
          cy="200"
          r={radius}
          fill="none"
          stroke="#00e676"
          strokeWidth={stroke}
          strokeDasharray={`${upLength} ${downLength}`}
          transform="rotate(-90 200 200)"
        />

        {/* DOWN */}
        <circle
          cx="200"
          cy="200"
          r={radius}
          fill="none"
          stroke="#ff5252"
          strokeWidth={stroke}
          strokeDasharray={`${downLength} ${upLength}`}
          strokeDashoffset={-upLength}
          transform="rotate(-90 200 200)"
        />
        <text
          x={upLabel.x}
          y={upLabel.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="bold"
          fill="white"
        >
          Up {upPct.toFixed(1)}%
        </text>

        <text
          x={downLabel.x}
          y={downLabel.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="bold"
          fill="white"
        >
          Down {downPct.toFixed(1)}%
        </text>

        {/* CENTER */}
        <text
          x="200"
          y="190"
          textAnchor="middle"
          fontSize="32"
          fontWeight="bold"
          fill="white"
        >
          {data.ratio}
        </text>
        <text x="200" y="220" textAnchor="middle" fontSize="14" fill="#aaa">
          Audit Ratio
        </text>
      </svg>

      <div>
        <p>
          <strong>Up:</strong> {data.up} ({upPct.toFixed(1)}%)
        </p>
        <p>
          <strong>Down:</strong> {data.down} ({downPct.toFixed(1)}%)
        </p>
      </div>
    </div>
  );
}
