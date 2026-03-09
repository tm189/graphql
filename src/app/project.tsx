"use client";
import "./graphs.css";
import { useEffect, useState } from "react";

interface XPProject {
  project: string;
  xp: number;
}

export default function XPByProjectGraph({ token }: { token: string }) {
  const [data, setData] = useState<XPProject[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      const query = `
        query {
          transaction(where: { type: { _eq: "xp" } }) {
            amount
            object {
              name
              type
            }
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
        },
      );

      const json = await res.json();
      const tx = json.data.transaction;

      const map = new Map<string, number>();

      for (const t of tx) {
        if (t.object?.type !== "project") continue;
        map.set(t.object.name, (map.get(t.object.name) || 0) + t.amount);
      }

      const result = Array.from(map.entries()).map(([project, xp]) => ({
        project,
        xp,
      }));

      setData(result);
    };

    fetchData();
  }, [token]);

  if (!data.length) {
    return <p className="xp-empty">No XP data</p>;
  }

  const width = Math.max(600, data.length * 70);
  const height = 420;

  const paddingTop = 40;
  const paddingRight = 40;
  const paddingBottom = 150;
  const paddingLeft = 55;

  const maxXP = Math.max(...data.map((d) => d.xp));
  const yMax = Math.ceil(maxXP / 1000) * 1000;
  const ticks = 10;

  function formatXP(value: number): string {
    if (value < 1000) return value.toString();
    const kb = value / 1000;

    if (kb >= 100) return Math.round(kb).toString();
    if (kb >= 10) return (Math.round(kb * 10) / 10).toFixed(1);
    return (Math.round(kb * 100) / 100).toFixed(2);
  }

  return (
    <div className="xp-graph">
      <svg className="xp-graph-svg" viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const value = (yMax / ticks) * i;
          const y =
            height -
            paddingBottom -
            (value / yMax) * (height - paddingTop - paddingBottom);

          return (
            <g key={`y-${i}`}>
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={y}
                y2={y}
                className="xp-grid-line"
              />

              <text
                x={paddingLeft - 8}
                y={y + 4}
                className="xp-y-label"
                textAnchor="end"
              >
                {formatXP(value)}
              </text>
            </g>
          );
        })}

        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom}
          className="xp-axis"
        />
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          className="xp-axis"
        />

        {data.map((d, i) => {
          const chartHeight = height - paddingTop - paddingBottom;
          const barHeight = (d.xp / yMax) * chartHeight;
          const barWidth = (width - paddingLeft - paddingRight) / data.length;

          const x = paddingLeft + i * barWidth + 10;
          const y = height - paddingBottom - barHeight;

          const labelX = x + (barWidth - 20) / 2;
          const labelY = height - paddingBottom + 18;

          return (
            <g key={d.project}>
              <rect
                x={x}
                y={y}
                width={barWidth - 20}
                height={barHeight}
                rx={4}
                className="xp-bar"
              />

              <text
                x={labelX}
                y={y - 6}
                textAnchor="middle"
                className="xp-bar-value"
              >
                {formatXP(d.xp)}
              </text>

              <text
                x={labelX}
                y={labelY}
                transform={`rotate(-50 ${labelX} ${labelY})`}
                textAnchor="end"
                className="xp-project-label"
              >
                {d.project}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
