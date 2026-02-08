"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FetchUserData from "../FetchUserData";
import TotalXP from "../TotalXP";
import JSPiscineXP from "../JsPiscine";
import GoPiscineXP from "../GoPiscine";
import Audit from "../audit";
import ProjectResultsGraph from "../project";
import MyAudits from "../myaudits";
import "./profile.css";

export default function ProfilePage() {
  const router = useRouter();

  // ✅ always the same on first render
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("jwt");
    setToken(t);

    if (!t) router.push("/");
  }, [router]);

  function logout() {
    localStorage.removeItem("jwt");
    router.push("/");
  }

  if (!mounted) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">PROFILE</h1>

        <button className="logout-btn" onClick={logout}>
          Logout
          <img src="./logout.png" alt="Logout" width={20} height={20} />
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
            {token && <TotalXP token={token} />}
            {token && <JSPiscineXP token={token} />}
            {token && <GoPiscineXP token={token} />}
          </div>
        </div>

        <div className="profile-card">
          {token && <MyAudits token={token} />}
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
