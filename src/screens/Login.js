import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let navigate = useNavigate();

  // 📝 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }

      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem("token", data.authToken);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        height: "100vh",
        backgroundSize: "cover",
      }}
    >
      <Navbar />

      <div className="container">
        <form
          className="w-50 m-auto mt-5 border bg-dark border-success rounded p-3"
          onSubmit={handleSubmit}
        >
          <h3 className="text-white text-center">Login</h3>

          {/* ❗ Error Message */}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="m-3">
            <label className="form-label text-white">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="m-3">
            <label className="form-label text-white">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
            />
          </div>

          <button
            type="submit"
            className="m-3 btn btn-success"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link to="/signup" className="m-3 mx-1 btn btn-danger">
            New User
          </Link>
        </form>
      </div>
    </div>
  );
}
