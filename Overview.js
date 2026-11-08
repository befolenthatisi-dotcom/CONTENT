import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard/stats")
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <div className="notice">Could not load statistics: {error}</div>;
  }
  if (!stats) return <p className="muted">Loading...</p>;

  const cards = [
    ["Total content", stats.totalContent],
    ["Published", stats.published],
    ["Drafts", stats.drafts],
    ["Scheduled", stats.scheduled],
    ["Comments", stats.comments],
    ["Total views", stats.views],
    ["Total likes", stats.likes],
  ];

  return (
    <div>
      <div className="stat-grid">
        {cards.map(([label, value]) => (
          <div className="panel stat" key={label}>
            <span className="stat-value">{value ?? 0}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      {stats.popular && stats.popular.length > 0 && (
        <div className="panel">
          <h3>Most popular content</h3>
          <ul className="plain-list">
            {stats.popular.map((c) => (
              <li key={c._id}>
                <span>{c.title}</span>
                <span className="muted">{c.views} views</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}