import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });
  let [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let navigate = useNavigate();

  // 📍 Get Location
  const handleGetLocation = async () => {
    try {
      setLoading(true);
      setError("");

      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      );

      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      const response = await fetch(
        "http://localhost:5000/api/auth/getlocation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latlong: { lat, long } }),
        },
      );
      const data = await response.json();
      setCredentials((prev) => ({
        ...prev,
        location: data.location,
      }));
    } catch (err) {
      console.error(err);
      setError("Unable to fetch location");
    } finally {
      setLoading(false);
    }
  };

  // 📝 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      // credentials: 'include',
      // Origin:"http://localhost:3000/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.location,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save the auth toke to local storage and redirect
      localStorage.setItem("token", json.authToken);
      navigate("/login");
    } else {
      setError(json.error || "Signup failed");
    }
  };

  // 🔄 Handle Input
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <Navbar />

      <div className="container">
        <form
          className="w-50 m-auto mt-5 border bg-dark border-success rounded p-3"
          onSubmit={handleSubmit}
        >
          <h3 className="text-white text-center">Signup</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          <div className="m-3">
            <label className="form-label text-white">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={credentials.name}
              onChange={onChange}
              required
            />
          </div>
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
            <label className="form-label text-white">Address</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={credentials.location}
              onChange={onChange}
              placeholder="Click below for fetching location"
            />
          </div>
          <div className="m-3">
            <button
              type="button"
              onClick={handleGetLocation}
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "Fetching Location..." : "Use Current Location"}
            </button>
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
            {loading ? "Creating Account..." : "Signup"}
          </button>
          <Link to="/login" className="m-3 mx-1 btn btn-danger">
            Already a user
          </Link>
        </form>
      </div>
    </div>
  );
}
