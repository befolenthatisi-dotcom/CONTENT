import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { api, getViewerId } from "../api/api";
import Navbar from "../components/Navbar.js";
import { thumbFor } from "../utils/images";
import sampleContent from "../data/sampleContent";

export default function ContentDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api(`/contents/${id}`);
        if (!data || !data._id) throw new Error("Bad response");
        setItem(data);
      } catch (error) {
        const sample = sampleContent.find((c) => c._id === id);
        if (sample) setItem(sample);
        else setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const loadEngagement = useCallback(async () => {
  try {
    const l = await api(`/likes/${id}?viewerId=${getViewerId()}`);
    setLikeCount(l.count || 0);
    setLiked(!!l.liked);

    const c = await api(`/comments/${id}`);
    if (Array.isArray(c)) setComments(c);
  } catch (error) {
    setNotFound(true);
  }
}, [id]);
 
useEffect(() => {
  loadEngagement();
}, [loadEngagement]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      window.prompt("Copy this link:", window.location.href);
    }
  };

  const like = async () => {
    setMsg("");
    try {
      const r = await api("/likes", {
        method: "POST",
        body: JSON.stringify({ contentId: id, viewerId: getViewerId() }),
      });
      setLikeCount(r.count);
      setLiked(true);
    } catch (e) {
      setMsg(e.message);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api("/comments", {
        method: "POST",
        body: JSON.stringify({ contentId: id, displayName: name, text }),
      });
      setText("");
      await loadEngagement();
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (loading) {
    return (<div><Navbar /><p className="muted container">Loading...</p></div>);
  }

  if (notFound || !item) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h2 className="section-title">Content not found</h2>
          <Link to="/" className="btn btn-outline back-btn">← Back to home</Link>
        </div>
      </div>
    );
  }

  const date = item.publishDate ? new Date(item.publishDate).toLocaleDateString() : "";

  return (
    <div>
      <Navbar />
      <main className="container details">
        <Link to="/" className="back-link">Back</Link>

        <div
          className="details-banner"
          style={item.thumbnailUrl ? { backgroundImage: `url(${item.thumbnailUrl})` } : undefined}
        >
          <span className="badge">{item.contentType}</span>
        </div>

        <span className="card-category">{item.category}</span>
        <h1>{item.title}</h1>

        <div className="card-meta details-meta">
          <span>Published {date}</span>
          <span>{item.views || 0} views</span>
        </div>

        <p className="details-desc">{item.description}</p>

        {item.articleContent && <div className="article-text">{item.articleContent}</div>}

        {item.mediaUrl && (
          <a className="btn" href={item.mediaUrl} target="_blank" rel="noreferrer">
            Open media
          </a>
        )}

        <div className="actions">
          <button className="btn btn-outline" onClick={like} disabled={liked}>
            {liked ? "Liked" : "Like"} ({likeCount})
          </button>
          <button className="btn btn-outline" onClick={copyLink}>
            {copied ? "Link copied!" : "Share / copy link"}
          </button>
        </div>

        {msg && <div className="error">{msg}</div>}

        <section className="comments">
          <h2 className="section-title">Comments ({comments.length})</h2>

          <form className="panel form" onSubmit={submitComment}>
            <label>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength="50" required />
            <label>Comment</label>
            <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} maxLength="500" required />
            <button className="btn" type="submit">Post comment</button>
          </form>

          {comments.length === 0 ? (
            <p className="muted">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div className="panel comment" key={c._id}>
                <strong>{c.displayName}</strong>
                <span className="muted"> · {new Date(c.createdAt).toLocaleDateString()}</span>
                <p>{c.text}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}