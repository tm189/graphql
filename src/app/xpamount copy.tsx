"use client";
import { useEffect, useState } from "react";

export default function JSPiscineXP({ token }: { token: string }) {
  const [totalXP, setTotalXP] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchXP = async () => {
      const query = `query GetProjectExamPiscineXP {
  transaction(
    where: {
      type: { _eq: "xp" }
      object: {
        type: { _in: ["exercise"] }
      }
    }
  ) {
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
      const transactions = json.data.transaction;

      const sum = transactions.reduce(
        (acc: number, t: { amount: number }) => acc + t.amount,
        0
      );

      setTotalXP(sum);
    };

    fetchXP();
  }, [token]);

  if (totalXP === null) return <p>Loading XP…</p>;
  function formatXP(value: number): string {
    if (value < 1000) return value.toString();
    const kb = value / 1000;

    if (kb >= 100) return Math.round(kb).toString();
    if (kb >= 10) return (Math.round(kb * 10) / 10).toFixed(1);
    return (Math.round(kb * 100) / 100).toFixed(2);
  }
  return (
    <div>
      <h2>JS Piscine XP</h2>
      <p>{Number(formatXP(totalXP)) + 1}</p>
      <p>{totalXP}</p>
    </div>
  );
}

export function RawXPDebug({ token }: { token: string }) {
  const [raw, setRaw] = useState<unknown[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchRaw = async () => {
      try {
        const query = `
          query {
            transaction(where: { type: { _eq: "xp" } }) {
              id
              amount
              type
              createdAt
              campus
              path
              eventId
              object {
                id
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
          }
        );

        const json = await res.json();
        setRaw(json.data.transaction);
      } catch (e) {
        setError("Failed to fetch XP transactions");
      }
    };

    fetchRaw();
  }, [token]);

  if (error) return <p>{error}</p>;
  if (!raw) return <p>Loading raw XP data…</p>;

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
      <h3>Raw XP Transactions</h3>
      <pre
        style={{
          background: "#0b1023",
          color: "#e9ecff",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "12px",
          maxHeight: "500px",
          overflow: "auto",
        }}
      >
        {JSON.stringify(raw, null, 2)}
      </pre>
    </div>
  );
}
