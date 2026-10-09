import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({ type = "search", title, description, actionLabel, actionTo = "/create" }) {
  const Icon = type === "bookmark" ? Bookmark : type === "write" ? PenLine : FileSearch;
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon size={26} /></span>
      <h3>{title || "Nothing to see here yet"}</h3>
      <p>{description || "Try changing your search or check back later."}</p>
      {actionLabel && <Link className="button button-primary" to={actionTo}>{actionLabel}</Link>}
    </div>
  );
}