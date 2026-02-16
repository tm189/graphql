"use client";
import "./graphs.css";
import { useAudit } from "./useAudit";

export default function Audit({ token }: { token: string }) {
  const audit = useAudit(token);

  if (!audit) return <p>Loading audit data…</p>;

  const { up, down, ratio } = audit;

  const total = up + down;
  const upPercentage = (up / total) * 100;
  const downPercentage = (down / total) * 100;

  const radius = 140;
  const stroke = 36;
  const circumference = 2 * Math.PI * radius;
  const upLength = (upPercentage / 100) * circumference;
  const downLength = (downPercentage / 100) * circumference;

  return (
    <div className="audit">
      <h3 className="audit-title">Audit Ratio</h3>

      <svg className="audit-chart" viewBox="0 0 400 400">
        <defs>
          <path
            id="upPath"
            d="M 200,200 m -100,0 a 70,70 0 1,1 235,0 a 70,70 0 1,1 -235,0"
          />
          <path
            id="downPath"
            d="M 200,200 m 70,0 a 70,70 0 1,0 -210,0 a 70,70 0 1,0 210,0"
          />
        </defs>

        <circle
          cx="200"
          cy="200"
          r={radius}
          stroke="#22c55e"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${upLength} ${downLength}`}
          transform="rotate(-90 200 200)"
        />
        <circle
          cx="200"
          cy="200"
          r={radius}
          stroke="#ef4444"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${downLength} ${upLength}`}
          strokeDashoffset={-upLength}
          transform="rotate(-90 200 200)"
        />

        <text className="audit-ring-text">
          <textPath href="#upPath" startOffset="50%" textAnchor="middle">
            Up {upPercentage.toFixed(1)}%
          </textPath>
        </text>

        <text className="audit-ring-text">
          <textPath href="#downPath" startOffset="50%" textAnchor="middle">
            Down {downPercentage.toFixed(1)}%
          </textPath>
        </text>

        <text
          x="200"
          y="200"
          textAnchor="middle"
          className="audit-center-value"
        >
          {ratio.toFixed(1)}
        </text>

        <text
          x="200"
          y="222"
          textAnchor="middle"
          className="audit-center-label"
        >
          Ratio
        </text>
      </svg>

      <div className="audit-stats">
        <div className="audit-stat">
          <span>Up</span>
          <strong>{(up / 1000).toFixed(0)} kB</strong>
        </div>
        <div className="audit-stat">
          <span>Down</span>
          <strong>{(down / 1000).toFixed(0)} kB</strong>
        </div>
      </div>
    </div>
  );
}
