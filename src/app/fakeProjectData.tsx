"use client";
import "./graphs.css";
import { useEffect, useState } from "react";

interface XPProject {
  project: string;
  xp: number;
}

export default function FakeProjects({ token }: { token: string }) {
  const [data, setData] = useState<XPProject[]>([]);
  useEffect(() => {
    if (!token) return;

    const fake: XPProject[] = [];

    for (let i = 1; i <= 40; i++) {
      fake.push({
        project: `Project ${i}`,
        xp: Math.floor(Math.random() * 80000) + 5000,
      });
    }

    setData(fake);
  }, [token]);

  if (!data.length) {
    return <p className="xp-empty">No XP data</p>;
  }
  const width = Math.max(600, data.length * 70);
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
            </g>
          );
        })}
      </svg>
    </div>
  );
}
