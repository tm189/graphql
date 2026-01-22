"use client";
import { useState, useEffect } from "react";

type User = {
  id: string;
  attrs?: Record<string, unknown> | null;
  createdAt?: string | null;
  campus?: string | null;
};

export default function GeneralData({ token }: { token?: string }) {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchGeneralData = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = `
          query GetUsers {
            user {
              id
              attrs
              createdAt
              campus
            }
          }
        `;

        const response = await fetch(
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

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const result = await response.json();

        if (result.errors) {
          throw new Error(
            result.errors
              .map(
                (e: unknown) =>
                  (e as Record<string, unknown>)?.message ?? "Unknown error"
              )
              .join("; ")
          );
        }

        const users: User[] = (result.data?.user ?? []) as User[];

        setData(users);
      } catch (err: unknown) {
        console.error("Error fetching general data:", err);
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : err == null
            ? "Unknown error"
            : JSON.stringify(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchGeneralData();
  }, [token]);

  return (
    <div>
      <h2>General Data</h2>
      {loading && <p>Loading…</p>}
      {error && <pre>{error}</pre>}

      {data && data.length > 0 && (
        <div>
          <h3>Full User Details</h3>
          {data.map((user) => {
            const attrs = user.attrs as Record<string, unknown> | null;
            return (
              <details key={user.id}>
                <summary>
                  {user.id} — Campus: {user.campus || "N/A"}
                </summary>
                <div>
                  <p>
                    <strong>Email:</strong> {(attrs?.email as string) || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {(attrs?.PhoneNumber as string) || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {(attrs?.address as string) || "N/A"}
                  </p>
                  <p>
                    <strong>First Name:</strong>{" "}
                    {(attrs?.firstName as string) || "N/A"}
                  </p>
                  <p>
                    <strong>Last Name:</strong>{" "}
                    {(attrs?.lastName as string) || "N/A"}
                  </p>
                </div>
                <details>
                  <summary>View All Raw Data</summary>
                  <pre>{JSON.stringify(user, null, 2)}</pre>
                </details>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
