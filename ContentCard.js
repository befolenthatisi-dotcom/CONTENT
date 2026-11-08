
import { Link } from "react-router-dom";
import { thumbFor } from "../utils/images";

export default function ContentCard({ item }) {
  const date = item.publishDate
    ? new Date(item.publishDate).toLocaleDateString()
    : "Recently added";

  const description = item.description || "Explore this content to learn more.";

  const shortDescription =
    description.length > 105
      ? description.slice(0, 105) + "..."
      : description;

  const readingTime = Math.max(
    1,
    Math.ceil((description.split(/\s+/).length + (item.title || "").split(/\s+/).length) / 200)
  );

  return (
    <Link to={`/content/${item._id}`} className="card">
      <div className="card-thumb">
        <img
          src={thumbFor(item)}
          alt={item.title || "Content thumbnail"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <span className="badge">
          {item.contentType || "Article"}
        </span>
      </div>

      <div className="card-body">
        <span className="card-category">
          {item.category || "General"}
        </span>

        <h3>{item.title || "Untitled content"}</h3>

        <p>{shortDescription}</p>

        <div className="card-meta">
          <span>{date}</span>
          <span>{item.views || 0} views</span>
        </div>

        <div className="card-extra">
          <span>{readingTime} min read</span>
          <span className="read-more">Read Article</span>
        </div>
      </div>
    </Link>
  );
}
