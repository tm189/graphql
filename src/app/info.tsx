"use client";

import TotalXP from "./xpamount";
import { useAudit } from "./useAudit";
import AuditsDone from "./auditsDone";
import RawAuditData from "./rawData";
import { RawXPDebug } from "./xpamount";
export default function InfoPage({ token }: { token: string }) {
  return (
    <div>
      <div style={profileGrid}>
        <div>
          <TotalXP token={token} />
          <RawXPDebug token={token} />
        </div>

        <AuditsDone token={token} />
      </div>
      {/* <AuditRatio token={token} />
      <RawAuditData token={token} /> */}
    </div>
  );
}

function AuditRatio({ token }: { token: string }) {
  const audit = useAudit(token);
  if (!audit) {
    return null;
  }
  return (
    <div className="audit-ratio-info">
      <span>Audit ratio</span>
      <strong>{audit.ratio.toFixed(1)}</strong>
    </div>
  );
}

const profileGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};
