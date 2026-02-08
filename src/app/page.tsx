"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const existingToken = localStorage.getItem("jwt");
    if (existingToken) {
      router.replace("/profile");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch("https://learn.reboot01.com/api/auth/signin", {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${login}:${password}`)}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Invalid credentials");
      const jwt = await res.json();
      console.log("JWT:", jwt);

      if (!jwt) {
        throw new Error("Login failed: server returned invalid JWT");
      }
      localStorage.setItem("jwt", jwt);
      router.push("/profile");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>LOGIN</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username or Email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="password-wrapper form-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? "./hide.png" : "./show.png"}
                alt="Toggle password visibility"
                width={20}
                height={20}
              />
            </button>
          </div>

          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
