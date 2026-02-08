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

  const width = 600;
  const height = 300;
  const padding = 40;

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
      <h3 className="xp-graph-title">XP by Project</h3>

      <svg className="xp-graph-svg" viewBox={`0 0 ${width} ${height}`}>
        {/* Y AXIS + GRID */}
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const value = (yMax / ticks) * i;
          const y = height - padding - (value / yMax) * (height - padding * 2);

          return (
            <g key={`y-${i}`}>
              <line
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                className="xp-grid-line"
              />

              <text
                x={padding - 8}
                y={y + 4}
                className="xp-y-label"
                textAnchor="end"
              >
                {formatXP(value)}
              </text>
            </g>
          );
        })}

        {/* AXES */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          className="xp-axis"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          className="xp-axis"
        />

        {/* BARS */}
        {data.map((d, i) => {
          const barHeight = (d.xp / yMax) * (height - padding * 2);

          const barWidth = (width - padding * 2) / data.length;

          const x = padding + i * barWidth + 10;
          const y = height - padding - barHeight;

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
                x={x + (barWidth - 20) / 2}
                y={y - 6}
                textAnchor="middle"
                className="xp-bar-value"
              >
                {formatXP(d.xp)}
              </text>

              <text
                transform={`translate(${x + (barWidth - 20) / 2}, ${
                  height - padding + 6
                }) rotate(-60)`}
                textAnchor="end"
                className="xp-project-label"
              >
                {d.project}
              </text>
              {/* <foreignObject
                x={x}
                y={height - padding + 8}
                width={barWidth - 20}
                height={60}
              >
                <div className="xp-project-label-fo">{d.project}</div>
              </foreignObject> */}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
