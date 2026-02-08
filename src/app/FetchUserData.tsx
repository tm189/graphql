"use client";
import { useState, useEffect } from "react";
import "./fetchuserdata.css";
interface UserAttrs {
  firstName?: string;
  lastName?: string;
  email?: string;
  Degree?: string;
}

interface UserData {
  id: string;
  attrs: UserAttrs | null;
  createdAt: string | null;
  campus: string | null;
}

export default function FetchUserData({
  token,
  onUserName,
}: {
  token?: string;
  onUserName?: (name: string) => void;
}) {
  const [data, setData] = useState<UserData[] | null>(null);
  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const query = `
        query GetUsersData {
          user {
            id
            attrs
            createdAt
            campus
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

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const result = await res.json();
        const users = result.data.user;
        setData(users);

        if (onUserName && users.length > 0) {
          const u = users[0];
          const first = u.attrs?.firstName ?? "";
          const last = u.attrs?.lastName ?? "";
          onUserName(`${first} ${last}`.trim());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, onUserName]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fixDate = (date: string | null) => {
    if (!date) return "N/A";
    if (!mounted) return "…"; // stable placeholder for SSR + first client render
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="user-info">
      <h2 className="user-info-title">General Info</h2>

      {data && data.length > 0 ? (
        data.map((user) => (
          <div key={user.id} className="user-info-grid">
            <div>
              <span className="label">ID</span>
              <span className="value">{user.id}</span>
            </div>
            <div>
              <span className="label">Email</span>
              <span className="value">{user.attrs?.email ?? "N/A"}</span>
            </div>
            <div>
              <span className="label">Name</span>
              <span className="value">
                {user.attrs?.firstName ?? "N/A"} {user.attrs?.lastName ?? ""}
              </span>
            </div>

            <div>
              <span className="label">Campus</span>
              <span className="value">{user.campus || "N/A"}</span>
            </div>
            <div>
              <span className="label">Degree</span>
              <span className="value">{user.attrs?.Degree || "N/A"}</span>
            </div>
            <div>
              <span className="label">Join Date</span>
              <span className="value">{fixDate(user.createdAt)}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="empty">No user data available.</p>
      )}

      {/* {data && (
        <details className="raw-data">
          <summary>View Raw Data</summary>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </details>
      )} */}
    </div>
  );
}
