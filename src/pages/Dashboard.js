import { useState } from "react";
import Navbar from "../components/Navbar.js";
import Overview from "../components/Overview.js";
import ContentManager from "../components/ContentManager.js";
import CommentModeration from "../components/CommentModeration.js";

const TABS = [
  {
    id: "overview",
    label: "Overview",
    description: "Monitor your platform performance and activity.",
  },
  {
    id: "content",
    label: "Content Manager",
    description: "Create, edit, organise and publish your content.",
  },
  {
    id: "comments",
    label: "Comment Moderation",
    description: "Review audience feedback and manage discussions.",
  },
];

export default function Dashboard() {
  const [tab, setTab] = useState("overview");

  const activeTab = TABS.find((t) => t.id === tab);

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="container dashboard-container">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">THINKSPACE CREATOR WORKSPACE</span>
            <h1>Creator Dashboard</h1>
            <p>
              Manage your publications, monitor engagement and
              keep your audience connected.
            </p>
          </div>
        </header>

        <nav className="dashboard-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={
                t.id === tab
                  ? "dashboard-tab active"
                  : "dashboard-tab"
              }
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="dashboard-section-heading">
          <div>
            <h2>{activeTab.label}</h2>
            <p>{activeTab.description}</p>
          </div>
          <span className="dashboard-section-status">
            CREATOR PANEL
          </span>
        </div>

        <section className="dashboard-content">
          {tab === "overview" && <Overview />}
          {tab === "content" && <ContentManager />}
          {tab === "comments" && <CommentModeration />}
        </section>
      </main>

      <footer className="footer">
        <strong>ThinkSpace</strong>
        <p>A space for ideas, knowledge and creativity.</p>
        <span>Creator Management Workspace · © 2026 ThinkSpace</span>
      </footer>
    </div>
  );
}