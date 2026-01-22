// "use client";
// import { useEffect, useState } from "react";
// interface Transaction {
//   id: string;
//   type: "up" | "down" | "xp";
//   amount: number;
// }
// interface AuditData {
//   up: number;
//   down: number;
//   xp: number;
// }

// export default function Audit({ token }: { token: string }) {
//   const [data, setData] = useState<AuditData | null>(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       const query = `
//                 query {
//                     transaction {
//                     id
//                     type
//                     amount
//                     }}`;

//       const res = await fetch(
//         "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ query }),
//         }
//       );
//       const result = await res.json();
//       const t: Transaction[] = result.data.transaction;

//       let up = 0;
//       let down = 0;

//       for (const tr of t) {
//         if (tr.type === "up") up += tr.amount;
//         if (tr.type === "down") down += tr.amount;
//       }
//       const xp = down === 0 ? 0 : Number((up / down).toFixed(2));
//       setData({ up, down, xp });
//     };
//     fetchData();
//   }, [token]);

//   /* MATH */
//   if (!data) return <p>Loading audit data…</p>;

//   const total = data.up + data.down;
//   const upPercentage = (data.up / total) * 100;
//   const downPercentage = (data.down / total) * 100;

//   const radius = 140;
//   const stroke = 36;
//   const circumference = 2 * Math.PI * radius;

//   const upLength = (upPercentage / 100) * circumference;
//   const downLength = (downPercentage / 100) * circumference;

//   return (
//     <div>
//       <h2>Audit Ratio Graph 2</h2>
//       <svg viewBox="0 0 400 400" width="400" height="400">
//         <defs>
//           <path
//             id="upPath"
//             d="
//         M 200,200
//         m -100,0
//         a 70,70 0 1,1 235,0
//         a 70,70 0 1,1 -235,0
//       "
//           />
//           <path
//             id="downPath"
//             d="
//     M 200,200
//     m 70,0
//     a 70,70 0 1,0 -210,0
//     a 70,70 0 1,0 210,0
//   "
//           />
//         </defs>
//         <circle
//           cx="200"
//           cy="200"
//           r={radius}
//           stroke="#00e676"
//           strokeWidth={stroke}
//           fill="none"
//           strokeDasharray={`${upLength} ${downLength}`}
//           transform="rotate(-90 200 200)"
//         />
//         <circle
//           cx="200"
//           cy="200"
//           r={radius}
//           stroke="#ff5252"
//           strokeWidth={stroke}
//           fill="none"
//           strokeDasharray={`${downLength} ${upLength}`}
//           strokeDashoffset={-upLength}
//           transform="rotate(-90 200 200)"
//         />
//         <text fill="white" fontSize="14">
//           <textPath href="#upPath" startOffset="50%" textAnchor="middle">
//             {`Up ${upPercentage.toFixed(1)}%`}
//           </textPath>
//         </text>
//         <text fill="white" fontSize="14">
//           <textPath href="#downPath" startOffset="50%" textAnchor="middle">
//             {`Down ${downPercentage.toFixed(1)}%`}
//           </textPath>
//         </text>

//         <text x="200" y="200" fill="white" textAnchor="middle">
//           {data.xp.toFixed(1)}
//         </text>
//         <text x="200" y="220" fill="white" textAnchor="middle">
//           Audit Ratio
//         </text>
//       </svg>
//       <div>
//         <p>
//           <strong>Up:</strong> {data.up} ({upPercentage.toFixed(1)}%)
//         </p>
//         <p>
//           <strong>Down:</strong> {data.down} ({downPercentage.toFixed(1)}%)
//         </p>
//       </div>
//     </div>
//   );
// }

// "use client";
// import "./graphs.css";
// import { useEffect, useState } from "react";

// interface Transaction {
//   id: string;
//   type: "up" | "down" | "xp";
//   amount: number;
// }
// interface AuditData {
//   up: number;
//   down: number;
//   xp: number;
// }

// export default function Audit({ token }: { token: string }) {
//   const [data, setData] = useState<AuditData | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const query = `
//         query {
//           transaction {
//             id
//             type
//             amount
//           }
//         }`;

//       const res = await fetch(
//         "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ query }),
//         }
//       );

//       const result = await res.json();
//       const t: Transaction[] = result.data.transaction;

//       let up = 0;
//       let down = 0;

//       for (const tr of t) {
//         if (tr.type === "up") up += tr.amount;
//         if (tr.type === "down") down += tr.amount;
//       }

//       const xp = down === 0 ? 0 : Number((up / down).toFixed(2));
//       setData({ up, down, xp });
//     };

//     fetchData();
//   }, [token]);

//   if (!data) return <p>Loading audit data…</p>;

//   const total = data.up + data.down;
//   const upPercentage = (data.up / total) * 100;
//   const downPercentage = (data.down / total) * 100;

//   const radius = 140;
//   const stroke = 36;
//   const circumference = 2 * Math.PI * radius;
//   const upLength = (upPercentage / 100) * circumference;
//   const downLength = (downPercentage / 100) * circumference;

//   return (
//     <div className="audit">
//       <h3 className="audit-title">Audit Ratio</h3>

//       <svg className="audit-chart" viewBox="0 0 400 400">
//         <defs>
//           <path
//             id="upPath"
//             d="M 200,200 m -100,0 a 70,70 0 1,1 235,0 a 70,70 0 1,1 -235,0"
//           />
//           <path
//             id="downPath"
//             d="M 200,200 m 70,0 a 70,70 0 1,0 -210,0 a 70,70 0 1,0 210,0"
//           />
//         </defs>

//         <circle
//           cx="200"
//           cy="200"
//           r={radius}
//           stroke="#22c55e"
//           strokeWidth={stroke}
//           fill="none"
//           strokeDasharray={`${upLength} ${downLength}`}
//           transform="rotate(-90 200 200)"
//         />
//         <circle
//           cx="200"
//           cy="200"
//           r={radius}
//           stroke="#ef4444"
//           strokeWidth={stroke}
//           fill="none"
//           strokeDasharray={`${downLength} ${upLength}`}
//           strokeDashoffset={-upLength}
//           transform="rotate(-90 200 200)"
//         />

//         <text className="audit-ring-text">
//           <textPath href="#upPath" startOffset="50%" textAnchor="middle">
//             Up {upPercentage.toFixed(1)}%
//           </textPath>
//         </text>
//         <text className="audit-ring-text">
//           <textPath href="#downPath" startOffset="50%" textAnchor="middle">
//             Down {downPercentage.toFixed(1)}%
//           </textPath>
//         </text>

//         <text
//           x="200"
//           y="200"
//           textAnchor="middle"
//           className="audit-center-value"
//         >
//           {data.xp.toFixed(1)}
//         </text>
//         <text
//           x="200"
//           y="222"
//           textAnchor="middle"
//           className="audit-center-label"
//         >
//           Ratio
//         </text>
//       </svg>

//       <div className="audit-stats">
//         <div className="audit-stat">
//           <span>Up</span>
//           <strong>{data.up}</strong>
//         </div>
//         <div className="audit-stat">
//           <span>Down</span>
//           <strong>{data.down}</strong>
//         </div>
//       </div>
//     </div>
//   );
// }
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
          <strong>{up}</strong>
        </div>
        <div className="audit-stat">
          <span>Down</span>
          <strong>{down}</strong>
        </div>
      </div>
    </div>
  );
}
