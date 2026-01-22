// "use client";

// import { useEffect, useState } from "react";

// interface Audit {
//   id: string;
//   groupId: string;
//   grade: number | null;
//   createdAt: string;
// }

// export default function AuditsDone({ token }: { token: string }) {
//   const [audits, setAudits] = useState<Audit[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!token) return;

//     const fetchAudits = async () => {
//       try {
//         // Step 1: fetch current user ID
//         const userRes = await fetch(
//           "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               query: `
//                 query {
//                   user {
//                     id
//                   }
//                 }
//               `,
//             }),
//           }
//         );

//         const userJson = await userRes.json();
//         const currentUserId = userJson.data.user[0]?.id;

//         if (!currentUserId) {
//           setError("Could not fetch current user ID.");
//           setLoading(false);
//           return;
//         }

//         // Step 2: fetch audits done by this user
//         const auditRes = await fetch(
//           "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               query: `
//     query {
//       audit(where: {
//         auditorId: { _eq: "${currentUserId}" },
//         grade: { _is_null: false }
//       }) {
//         id
//         groupId
//         grade
//         createdAt
//       }
//     }
//   `,
//             }),
//           }
//         );

//         const auditJson = await auditRes.json();
//         setAudits(auditJson.data.audit);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch audits.");
//         setAudits([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAudits();
//   }, [token]);

//   if (loading) return <p>Loading audits…</p>;
//   if (error) return <p>{error}</p>;
//   if (!audits || audits.length === 0) return <p>No audits done yet.</p>;

//   return (
//     <div className="audits-done">
//       <h2>Audits I Did</h2>
//       <ul>
//         {audits.map((audit) => (
//           <li key={audit.id}>
//             <strong>Group:</strong> {audit.groupId} <strong>Grade:</strong>{" "}
//             {audit.grade !== null ? audit.grade.toFixed(2) : "N/A"}{" "}
//             <small>({new Date(audit.createdAt).toLocaleDateString()})</small>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";

// interface Transaction {
//   id: string;
//   type: "up" | "down" | "xp";
//   amount: number;
//   createdAt: string;
//   path: string;
// }

// export default function AuditsDone({ token }: { token: string }) {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!token) return;

//     const fetchTransactions = async () => {
//       try {
//         const query = `
//           query {
//             transaction(where: {type: {_eq: "up"}}) {
//               id
//               type
//               amount
//               createdAt
//               path
//             }
//           }
//         `;

//         const res = await fetch(
//           "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ query }),
//           }
//         );

//         const json = await res.json();

//         if (json.errors) {
//           console.error("GraphQL errors:", json.errors);
//           setError("Failed to fetch audits (restricted fields removed)");
//           return;
//         }

//         // Sort by createdAt descending (newest first)
//         const sortedTx = json.data.transaction.sort(
//           (a: Transaction, b: Transaction) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );

//         setTransactions(sortedTx);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch audits");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [token]);

//   if (loading) return <p>Loading audits…</p>;
//   if (error) return <p>{error}</p>;
//   if (transactions.length === 0) return <p>No audits done yet.</p>;

//   const getProjectName = (path: string) =>
//     path.split("/").filter(Boolean).pop();

//   function formatXP(value: number): string {
//     if (value < 1000) return value.toString();
//     const kb = value / 1000;

//     if (kb >= 100) return Math.round(kb).toString();
//     if (kb >= 10) return (Math.round(kb * 10) / 10).toFixed(1);
//     return (Math.round(kb * 100) / 100).toFixed(2);
//   }
//   return (
//     <div className="audits-done">
//       <h2>Audits You Completed</h2>
//       <ul>
//         {transactions.map((tx) => (
//           <li
//             key={tx.id}
//             style={{
//               marginBottom: "1em",
//               borderBottom: "1px solid #ddd",
//               paddingBottom: "0.5em",
//             }}
//           >
//             <div>
//               <strong>Project:</strong> {getProjectName(tx.path) || "Unknown"}
//             </div>
//             <div>
//               <strong>XP earned:</strong> {formatXP(tx.amount)}
//             </div>
//             <div>
//               <strong>Date:</strong>{" "}
//               {new Date(tx.createdAt).toLocaleDateString()}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import "./auditsDone.css";
interface Transaction {
  id: string;
  type: "up" | "down" | "xp";
  amount: number;
  createdAt: string;
  path: string;
}

const PAGE_SIZE = 2;

export default function AuditsDone({ token }: { token: string }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- fetch data ---------------- */

  useEffect(() => {
    if (!token) return;

    const fetchTransactions = async () => {
      try {
        const query = `
          query {
            transaction(where: { type: { _eq: "up" } }) {
              id
              type
              amount
              createdAt
              path
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

        const sorted = json.data.transaction.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setTransactions(sorted);
      } catch {
        setError("Failed to fetch audits");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  /* ---------------- page calculation ---------------- */

  const pages = Array.from({
    length: Math.ceil(transactions.length / PAGE_SIZE),
  }).map((_, i) =>
    transactions.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE)
  );

  /* ---------------- track active page ---------------- */

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updateActivePage = () => {
      const pageWidth = slider.clientWidth;
      if (pageWidth === 0) return;

      const index = Math.round(slider.scrollLeft / pageWidth);
      setActivePage(index);
    };

    // initial calculation (VERY IMPORTANT)
    updateActivePage();

    slider.addEventListener("scroll", updateActivePage, { passive: true });

    return () => {
      slider.removeEventListener("scroll", updateActivePage);
    };
  }, [pages.length]);

  /* ---------------- helpers ---------------- */

  const getProjectName = (path: string) =>
    path.split("/").filter(Boolean).pop();

  function formatXP(value: number): string {
    if (value < 1000) return value.toString();
    const kb = value / 1000;
    if (kb >= 100) return Math.round(kb).toString();
    if (kb >= 10) return (Math.round(kb * 10) / 10).toFixed(1);
    return (Math.round(kb * 100) / 100).toFixed(2);
  }

  /* ---------------- early returns ---------------- */

  if (loading) return <p>Loading audits…</p>;
  if (error) return <p>{error}</p>;
  if (transactions.length === 0) return <p>No audits done yet.</p>;

  /* ---------------- render ---------------- */
  const fixDate = function (date: string | null) {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="audits-done">
      <h2>Audits You Completed</h2>

      <div className="audit-slider" ref={sliderRef}>
        {pages.map((page, i) => (
          <div key={i} className="audit-page">
            <ul className="audit-list">
              {page.map((tx) => (
                <li key={tx.id} className="audit-item">
                  <div className="audit-bubble">
                    <div className="audit-row">
                      <span className="label">Project</span>
                      <span className="value">
                        {getProjectName(tx.path) || "Unknown"}
                      </span>
                    </div>

                    <div className="audit-row">
                      <span className="label">XP</span>
                      <span className="value">{tx.amount}</span>
                    </div>

                    <div className="audit-row">
                      <span className="label">Date</span>
                      <span className="value">{fixDate(tx.createdAt)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <div className="page-dots">
          {pages.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activePage ? "active" : ""}`}
              onClick={() => {
                sliderRef.current?.scrollTo({
                  left: i * sliderRef.current.clientWidth,
                  behavior: "smooth",
                });
              }}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
