import { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar.js";
import ContentCard from "../components/ContentCard.js";
import { categoryImage } from "../utils/images";

const PLATFORM = {
  name: "ThinkSpace",
  tagline: "A space for ideas, knowledge and creativity.",
};

const CREATOR = {
  name: "befolenthatisi",
  intro:
    "Welcome to ThinkSpace, a digital platform for discovering knowledge, exploring ideas and sharing creativity. Explore educational resources, technology insights, tutorials, entertainment and more. Find topics that interest you, gain new perspectives and engage with content that inspires you.",
  picture: "",
};

const CATEGORIES = [
  "Education",
  "Technology",
  "Entertainment",
  "Lifestyle",
  "Business",
  "Other",
];

const heroStyle = {
  backgroundImage:
    "linear-gradient(110deg, rgba(18, 37, 43, 0.96), rgba(13, 107, 99, 0.82)), url(/images/hero.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (category !== "All") params.set("category", category);

        const data = await api(`/contents?${params.toString()}`);

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response");
        }

        setItems(data);
        setOffline(false);
      } catch (error) {
        setItems([]);
        setOffline(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  const flagged = items.filter((c) => c.featured);
  const featured = flagged.length > 0 ? flagged : items.slice(0, 3);

  const totalViews = items.reduce(
    (sum, c) => sum + (Number(c.views) || 0),
    0
  );

  const totalCategories = new Set(
    items.map((c) => c.category).filter(Boolean)
  ).size;

  const goToContent = (cat) => {
    setCategory(cat);
    document.getElementById("all-content")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page">
      <Navbar />

      <header className="hero" style={heroStyle}>
        <div className="hero-content">
          {CREATOR.picture ? (
            <img
              className="avatar"
              src={CREATOR.picture}
              alt={CREATOR.name}
            />
          ) : (
            <div className="avatar avatar-letter">
              {CREATOR.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <span className="eyebrow">WELCOME TO {PLATFORM.name.toUpperCase()}</span>

            <h1>{CREATOR.name}</h1>

            <p>{CREATOR.intro}</p>

            <div className="hero-actions">
              <button
                className="btn hero-btn"
                onClick={() => goToContent("All")}
              >
                Explore content
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {offline && (
          <div className="notice">
            <strong>Server unavailable:</strong> Cannot reach the backend.
            Please try again shortly.
          </div>
        )}

        <section className="stats-strip">
          <div>
            <strong>{items.length}</strong>
            <span>Available content</span>
          </div>

          <div>
            <strong>{totalCategories}</strong>
            <span>Active categories</span>
          </div>

          <div>
            <strong>{totalViews.toLocaleString()}</strong>
            <span>Total views</span>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DISCOVER SOMETHING NEW</span>
              <h2 className="section-title">Explore categories</h2>
              <p className="section-description">
                Browse different areas of interest, from education
                and technology to business, entertainment and lifestyle.
                Select a category to find content related to that topic.
              </p>
            </div>
          </div>

          <div className="cat-tiles">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className="cat-tile"
                style={{ backgroundImage: `url("${categoryImage(c)}")` }}
                onClick={() => goToContent(c)}
              >
                <span>{c}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-section featured-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HIGHLIGHTS</span>
              <h2 className="section-title">Featured content</h2>
              <p className="section-description">
                Discover selected articles, tutorials and publications
                chosen to help you gain knowledge, stay informed and
                explore interesting ideas.
              </p>
            </div>

            <span className="section-count">
              {featured.length} {featured.length === 1 ? "item" : "items"}
            </span>
          </div>

          {featured.length > 0 ? (
            <div className="grid">
              {featured.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="content-message featured-empty">
              <h3>Featured content coming soon</h3>
              <p>
                Our highlighted publications will appear here.
                Check back for interesting content and new discoveries.
              </p>
            </div>
          )}
        </section>

        <section id="all-content" className="home-section content-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE CONTENT LIBRARY</span>
              <h2 className="section-title">Explore all content</h2>
              <p className="section-description">
                Browse all available publications. Search for specific
                topics or select a category to narrow down your results.
                Open any publication to read more and join the discussion.
              </p>
            </div>

            <span className="section-count">
              {items.length} {items.length === 1 ? "result" : "results"}
            </span>
          </div>

          <div className="search-wrapper">
            <span className="search-icon">⌕</span>

            <input
              className="search"
              type="text"
              placeholder="Search articles, tutorials and topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="chips">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                className={c === category ? "chip active" : "chip"}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="content-message">
              <h3>Loading content...</h3>
              <p>Please wait while we retrieve the latest publications.</p>
            </div>
          ) : items.length === 0 ? (
            <div className="content-message">
              <h3>No content found</h3>
              <p>
                Try another keyword or choose a different category
                to discover available content.
              </p>

              <button
                className="btn"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid">
              {items.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="about-band">
          <img
            src="/images/about.jpg"
            alt="Creative workspace"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = categoryImage("Education");
            }}
          />

          <div>
            <span className="eyebrow">ABOUT THINKSPACE</span>
            <h2>A space for ideas, knowledge and creativity.</h2>

            <p>
              ThinkSpace is a digital platform that brings together
              information, ideas and creative publications across
              different topics and interests.
            </p>

            <p>
              Visitors can explore educational resources, discover
              technology insights, read articles and tutorials,
              share publications and interact through likes and
              comments. The platform also provides a dedicated
              creator dashboard for managing publications and
              moderating audience feedback.
            </p>

            <button className="btn" onClick={() => goToContent("All")}>
              Discover more
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <strong>{PLATFORM.name}</strong>
        <p>{PLATFORM.tagline}</p>
        <span>© 2026 {PLATFORM.name} · All Rights Reserved</span>
      </footer>
    </div>
  );
}
