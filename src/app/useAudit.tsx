"use client";
import { useEffect, useState } from "react";

interface Transaction {
  type: "up" | "down" | "xp";
  amount: number;
}

export interface AuditResult {
  up: number;
  down: number;
  ratio: number;
}

export function useAudit(token: string) {
  const [audit, setAudit] = useState<AuditResult | null>(null);

  useEffect(() => {
    if (!token) {
      //   setAudit(null);
      return;
    }

    const fetchAudit = async () => {
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
      const transactions: Transaction[] = json.data.transaction;

      let up = 0;
      let down = 0;

      for (const t of transactions) {
        if (t.type === "up") up += t.amount;
        if (t.type === "down") down += t.amount;
      }

      const ratio = down === 0 ? 0 : Number((up / down).toFixed(2));

      setAudit({ up, down, ratio });
    };

    fetchAudit();
  }, [token]);

  return audit;
}
