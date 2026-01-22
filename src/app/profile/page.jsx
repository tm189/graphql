"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Audit from "../audit";
import ProjectResultsGraph from "../project";
import FetchUserData from "../FetchUserData";
import TotalXP from "../TotalXP";
import AuditsDone from "../auditsDone";
import JSPiscineXP from "../JsPiscine";

import GoPiscineXP from "../GoPiscine";

import "./profile.css";
export default function ProfilePage() {
  const router = useRouter();
  const [token] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt");
    }
    return null;
  });
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  function logout() {
    localStorage.removeItem("jwt");
    router.push("/");
  }

  return (
    <div className="profile-container">
      {/* HEADER */}
      <div className="profile-header">
        <h1 className="profile-title">PROFILE</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
      {userName && (
        <p className="profile-greeting">
          Hi <span>{userName}</span>
        </p>
      )}
      <div className="profile-card user-data">
        {token && <FetchUserData token={token} onUserName={setUserName} />}
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>XP Summary</h2>
          <div className="xp-card">
            <TotalXP token={token} />
            <JSPiscineXP token={token} />
            <GoPiscineXP token={token} />
          </div>
        </div>

        <div className="profile-card">
          <AuditsDone token={token} />
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>Audit Summary</h2>
          {token && <Audit token={token} />}
        </div>

        <div className="profile-card">
          <h2>Project Results</h2>
          {token && <ProjectResultsGraph token={token} />}
        </div>
      </div>
    </div>
  );
}
