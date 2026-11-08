import { useEffect, useState, useCallback } from "react";
import { api } from "../api/api";

const CATEGORIES = ["Education", "Technology", "Entertainment", "Lifestyle", "Business", "Other"];
const THUMBNAILS = [
  "education.jpg",
  "technology.jpg",
  "busines.jpg",
  "entertainment.jpg",
  "lifestyle.jpg",
  "other.jpg",
];
const TYPES = ["video", "article", "image", "podcast"];
const EMPTY = {
  title: "",
  description: "",
  category: "Education",
  contentType: "video",
  thumbnailUrl: "/IMAGES/education.jpg",
  mediaUrl: "",
  articleContent: "",
  status: "Draft",
  publishDate: "",
  featured: false,
};


const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function ContentManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = form hidden
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api("/contents/admin/all"));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError("");
  };

  const openEdit = (c) => {
    setForm({
      title: c.title || "",
      description: c.description || "",
      category: c.category || "Education",
      contentType: c.contentType || "video",
      thumbnailUrl: c.thumbnailUrl || "",
      mediaUrl: c.mediaUrl || "",
      articleContent: c.articleContent || "",
      status: c.status || "Draft",
      publishDate: toLocalInput(c.publishDate),
      featured: !!c.featured,
    });
    setEditingId(c._id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");

    if (form.status === "Scheduled" && !form.publishDate) {
      return setError("Choose a publication date and time for scheduled content.");
    }
    if (!form.mediaUrl.trim() && !form.articleContent.trim()) {
      return setError("Provide a media URL or article content.");
    }

    const payload = {
      ...form,
      publishDate: form.publishDate ? new Date(form.publishDate).toISOString() : undefined,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api(`/contents/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await api("/contents", { method: "POST", body: JSON.stringify(payload) });
      }
      setForm(null);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete "${c.title}"? This also removes its comments and likes.`)) return;
    try {
      await api(`/contents/${c._id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <h3>Your content ({items.length})</h3>
        {!form && <button className="btn" onClick={openNew}>+ Add content</button>}
      </div>

      {error && <div className="error">{error}</div>}

      {form && (
        <form className="panel form" onSubmit={save}>
          <h3>{editingId ? "Edit content" : "Add content"}</h3>

          <label>Title</label>
          <input name="title" value={form.title} onChange={change} required />

          <label>Description</label>
          <textarea name="description" rows="3" value={form.description} onChange={change} required />

          <div className="row">
            <div>
              <label>Category</label>
              <select name="category" value={form.category} onChange={change}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Content type</label>
              <select name="contentType" value={form.contentType} onChange={change}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          
          <label>Choose thumbnail image</label>

<select
  name="thumbnailUrl"
  value={form.thumbnailUrl}
  onChange={change}
>
  {THUMBNAILS.map((image) => (
    <option key={image} value={`/images/${image}`}>
      {image}
    </option>
  ))}
</select>

<div className="thumbnail-preview">
  <img
    src={form.thumbnailUrl}
    alt="Selected thumbnail preview"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />
  <span>Image preview</span>
</div>
          
          <label>Media URL (video, podcast or image link)</label>
          <input name="mediaUrl" value={form.mediaUrl} onChange={change} placeholder="https://..." />

          <label>Article content (optional if you gave a media URL)</label>
          <textarea name="articleContent" rows="5" value={form.articleContent} onChange={change} />

          <div className="row">
            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={change}>
                <option>Draft</option>
                <option>Published</option>
                <option>Scheduled</option>
              </select>
            </div>
            <div>
              <label>
                Publication date and time{form.status === "Scheduled" ? " (required)" : ""}
              </label>
              <input type="datetime-local" name="publishDate" value={form.publishDate} onChange={change} />
            </div>
          </div>

          <label className="check">
            <input type="checkbox" name="featured" checked={form.featured} onChange={change} />
            Show as featured on the home page
          </label>

          <div className="actions">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => { setForm(null); setEditingId(null); setError(""); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : items.length === 0 ? (
        <p className="muted">No content yet. Click "Add content" to create your first item.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Status</th>
                <th>Publish date</th>
                <th>Views</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>{c.category}</td>
                  <td>{c.contentType}</td>
                  <td><span className={`status status-${c.status}`}>{c.status}</span></td>
                  <td>{c.publishDate ? new Date(c.publishDate).toLocaleString() : "-"}</td>
                  <td>{c.views || 0}</td>
                  <td className="row-actions">
                    <button className="link-btn" onClick={() => openEdit(c)}>Edit</button>
                    <button className="link-btn danger" onClick={() => remove(c)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}