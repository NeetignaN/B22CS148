import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [longUrl, setLongUrl] = useState("");
  const [urlCode, setUrlCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUrls() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/url`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setUrls(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    }
    fetchUrls();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/url/shorten`,
        { longUrl, customCode: urlCode },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUrls([...urls, res.data]);
      setLongUrl("");
      setUrlCode("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <p>Welcome {user?.name}</p>

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Enter a code (optional)"
          value={urlCode}
          onChange={(e) => setUrlCode(e.target.value)}
        />{" "}
        <br />
        <button type="submit">Shorten</button>
      </form>

      <h3>Your URLs</h3>
      <ul>
        {urls.map((url) => (
          <li key={url._id}>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
              }}
              onClick={() =>
                window.open(
                  `${process.env.REACT_APP_API_BASE_URL}/url/${url.urlCode}`,
                  "_blank"
                )
              }
            >
              {url.shortUrl}
            </button>{" "}
            → {url.longUrl}
            <br />
            <small>
              Created at:{" "}
              {url.createdAt ? new Date(url.createdAt).toLocaleString() : "N/A"}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
