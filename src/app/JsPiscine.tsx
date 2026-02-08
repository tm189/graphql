"use client";
import { useEffect, useState } from "react";

export default function JSPiscineXP({ token }: { token: string }) {
  const [totalXP, setTotalXP] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchXP = async () => {
      const query = `
query GetProjectExamPiscineXP {
  transaction(
    where: {
      type: { _eq: "xp" }
      path: { _ilike: "%piscine-js%" }
      object: {
       
        type: { _in: ["raid", "exercise"] }
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
        },
      );

      const json = await res.json();
      const transactions = json.data.transaction;

      const sum = transactions.reduce(
        (acc: number, t: { amount: number }) => acc + t.amount,
        0,
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
    <div className="xp-stat">
      <div className="xp-row">
        <span className="xp-stat__label">JS Piscine XP</span>
        <span className="xp-stat__value">{Number(formatXP(totalXP))} kB</span>
      </div>

      {/* <p>{totalXP}</p> */}
    </div>
  );
}
