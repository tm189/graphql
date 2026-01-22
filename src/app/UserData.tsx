"use client";
import { useState, useEffect } from "react";

interface UserData {
  id: string;
  attrs: Record<string, unknown> | null;
  createdAt: string | null;
  campus: string | null;
}

export default function UserData({ token }: { token?: string }) {
  const [data, setData] = useState<UserData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchUserData = async () => {
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
        console.log("GraphQL Response:", result);

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
        const users: UserData[] = (result.data?.user ?? []) as UserData[];
        console.log("Users:", users);
        setData(users);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <div>
      <h2>User Data</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && data && data.length > 0 ? (
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              <strong>ID:</strong> {user.id} <br />
              <strong>Campus:</strong> {user.campus || "N/A"} <br />
              <strong>Created:</strong> {user.createdAt || "N/A"}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No user data available.</p>
      )}
    </div>
  );
}
