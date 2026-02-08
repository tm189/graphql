"use client";

import { useEffect, useRef, useState } from "react";
import "./auditsDone.css";

interface MyAuditRow {
  closureType: string;
  createdAt: string;
  group: {
    object: { name: string } | null;
    captain: { login: string } | null;
  } | null;
}

const PAGE_SIZE = 3;

export default function MyAudits({ token }: { token: string }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [audits, setAudits] = useState<MyAuditRow[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fixDate = (date: string | null | undefined) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  async function graphQLRequest(query: string) {
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

    if (json.errors?.length) {
      // show real error in console + UI
      console.error("GraphQL errors:", json.errors);
      throw new Error(json.errors[0]?.message || "GraphQL error");
    }

    return json.data;
  }

  useEffect(() => {
    if (!token) return;

    const fetchAudits = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Get userID from token-scoped transaction table
        const meData = await graphQLRequest(`
          query {
            transaction(limit: 1, order_by: { createdAt: desc }) {
              userId
            }
          }
        `);

        const userID: number | undefined = meData?.transaction?.[0]?.userId;
        if (!userID) {
          setAudits([]);
          setError("Could not determine user id (no transactions found).");
          return;
        }

        // 2) Your audits query (NO closureType filter here — we’ll filter in JS)
        const auditsData = await graphQLRequest(`
          query {
            myAudits: audit(
              distinct_on: groupId
              where: {
                auditorId: { _eq: ${userID} }
                group: { object: { type: { _eq: "project" } } }
              }
              order_by: [{ groupId: asc }, { createdAt: desc }]
            ) {
              closureType
              createdAt
              group {
                object { name }
                captain { login }
              }
            }
          }
        `);

        const rows: MyAuditRow[] = auditsData?.myAudits ?? [];

        // 3) Filter AFTER fetch (works whether closureType is enum or string)
        const blocked = new Set([
          "expired",
          "reassigned",
          "unused",
          "null",
          "canceled",
        ]);

        const cleaned = rows
          .filter((a) => a.group?.object?.name && a.group?.captain?.login)
          .filter((a) => !blocked.has(String(a.closureType).toLowerCase()))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        setAudits(cleaned);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to fetch audits");
        setAudits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, [token]);

  const pages = Array.from({
    length: Math.ceil(audits.length / PAGE_SIZE),
  }).map((_, i) => audits.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE));

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updateActivePage = () => {
      const pageWidth = slider.clientWidth;
      if (pageWidth === 0) return;
      setActivePage(Math.round(slider.scrollLeft / pageWidth));
    };

    updateActivePage();
    slider.addEventListener("scroll", updateActivePage, { passive: true });

    return () => slider.removeEventListener("scroll", updateActivePage);
  }, [pages.length]);

  if (loading) return <p>Loading audits…</p>;
  if (error) return <p>{error}</p>;
  if (audits.length === 0) return <p>No audits found.</p>;

  return (
    <div className="audits-done">
      <h2>Audits You Completed</h2>

      <div className="audit-slider" ref={sliderRef}>
        {pages.map((page, i) => (
          <div key={i} className="audit-page">
            <ul className="audit-list">
              {page.map((a, idx) => (
                <li
                  key={`${a.group?.object?.name}-${a.createdAt}-${idx}`}
                  className="audit-item"
                >
                  <div className="audit-bubble">
                    <div className="audit-row">
                      <span className="label">Project</span>
                      <span className="value">
                        {a.group?.object?.name || "Unknown"}
                      </span>
                    </div>

                    <div className="audit-row">
                      <span className="label">Captain</span>
                      <span className="value">
                        {a.group?.captain?.login || "Unknown"}
                      </span>
                    </div>
                    {/* 
                    <div className="audit-row">
                      <span className="label">Status</span>
                      <span className="value">
                        {String(a.closureType) || "—"}
                      </span>
                    </div> */}

                    <div className="audit-row">
                      <span className="label">Date</span>
                      <span className="value">{fixDate(a.createdAt)}</span>
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
                  left: i * (sliderRef.current?.clientWidth || 0),
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
