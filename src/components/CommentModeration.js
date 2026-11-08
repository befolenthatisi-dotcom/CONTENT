import { useEffect, useState, useCallback } from "react";
import { api } from "../api/api";

export default function CommentModeration() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setComments(await api("/comments/admin/all"));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    try {
      await api(`/comments/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api(`/comments/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p className="muted">Loading...</p>;

  return (
    <div>
      <h3 className="toolbar">Viewer comments ({comments.length})</h3>
      {error && <div className="notice">Could not load comments: {error}</div>}
      {!error && comments.length === 0 && <p className="muted">No comments yet.</p>}

      {comments.map((c) => (
        <div className="panel comment-row" key={c._id}>
          <div className="comment-main">
            <strong>{c.displayName}</strong>
            <span className="muted"> on {c.content?.title || "deleted content"}</span>
            <p>{c.text}</p>
            <span className={`status status-${c.status}`}>{c.status}</span>
          </div>
          <div className="row-actions">
            {c.status !== "approved" && (
              <button className="link-btn" onClick={() => setStatus(c._id, "approved")}>Approve</button>
            )}
            {c.status !== "hidden" && (
              <button className="link-btn" onClick={() => setStatus(c._id, "hidden")}>Hide</button>
            )}
            <button className="link-btn danger" onClick={() => remove(c._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}