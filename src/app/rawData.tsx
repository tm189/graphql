"use client";

import { useEffect, useState } from "react";

export default function RawAuditData({ token }: { token: string }) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const query = `
          query {
            audit {
              id
              groupId
              auditorId
              attrs
              grade
              createdAt
              updatedAt
              resultId
              version
              endAt
              
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
        console.log("Raw response:", json); // will now log data
        setData(json.data.audit); // safe now
      } catch (err) {
        console.error(err);
        setError("Failed to fetch raw audit data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Loading raw data…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Raw Audit Data</h2>
      <pre
        style={{
          maxHeight: "500px",
          overflow: "auto",
          background: "#070606ff",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
