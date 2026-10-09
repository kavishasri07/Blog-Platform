import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const categories = ["Technology", "Design", "Mindset", "Lifestyle", "Culture", "Work", "Other"];
const blankForm = { title: "", excerpt: "", content: "", author: "", category: "Technology", cover: "", tags: "" };

export default function BlogEditor({ blogs, onSave, onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const existing = blogs.find((blog) => blog.id === id);
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (existing) setForm({ title: existing.title || "", excerpt: existing.excerpt || "", content: existing.content || "", author: existing.author || "", category: existing.category || "Technology", cover: existing.cover || "", tags: (existing.tags || []).join(", ") });
  }, [existing?.id]);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Please add a title.";
    if (!form.excerpt.trim()) nextErrors.excerpt = "Please add a short summary.";
    if (!form.content.trim()) nextErrors.content = "Your story needs some content.";
    if (!form.author.trim()) nextErrors.author = "Please enter the author's name.";
    if (form.cover.trim() && !/^https?:\/\/\S+/i.test(form.cover.trim())) nextErrors.cover = "Use a valid image URL starting with http:// or https://.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setNotice(""); return; }

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      author: form.author.trim(),
      category: form.category,
      cover: form.cover.trim() || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85",
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 8),
      readingTime: Math.max(1, Math.ceil(form.content.trim().split(/\s+/).length / 200))
    };

    if (editing && existing) onUpdate(id, payload);
    else onSave(payload);
    setNotice(editing ? "Changes saved." : "Your story has been published.");
    navigate("/my-blogs", { state: { notice: editing ? "Changes saved successfully." : "Your story was published successfully." } });
  };

  if (editing && !existing) return <main className="section-shell page-main"><div className="form-panel"><h1>Story not found</h1><p>This story may have been deleted or the link is incorrect.</p><Link to="/my-blogs" className="button button-primary">Back to My blogs</Link></div></main>;

  return (
    <main className="editor-page section-shell">
      <Link to={editing ? `/blog/${id}` : "/"} className="back-link"><ArrowLeft size={16} /> {editing ? "Back to story" : "Back to explore"}</Link>
      <div className="editor-intro"><span className="section-kicker">{editing ? "MAKE IT EVEN BETTER" : "YOUR SPACE, YOUR STORY"}</span><h1>{editing ? "Edit your story" : "Put your thoughts into words"}<span className="heading-period">.</span></h1><p>Good stories begin with a first draft. Don't worry about making it perfect.</p></div>
      <form className="editor-form" onSubmit={submit} noValidate>
        <div className="form-panel">
          <div className="form-section-heading"><span className="form-step">01</span><div><h2>The essentials</h2><p>Give your story a clear title and a compelling introduction.</p></div></div>
          <div className="field"><label htmlFor="title">Story title <span>*</span></label><input id="title" name="title" value={form.title} onChange={change} placeholder="A title that makes people curious..." maxLength={120} aria-invalid={Boolean(errors.title)} />{errors.title && <span className="field-error">{errors.title}</span>}<span className="field-hint">{form.title.length}/120 characters</span></div>
          <div className="field"><label htmlFor="excerpt">Short summary <span>*</span></label><textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={change} placeholder="What will readers take away from this story?" rows={3} maxLength={240} aria-invalid={Boolean(errors.excerpt)} />{errors.excerpt && <span className="field-error">{errors.excerpt}</span>}<span className="field-hint">This appears on your blog card.</span></div>
          <div className="field-row">
            <div className="field"><label htmlFor="author">Author name <span>*</span></label><input id="author" name="author" value={form.author} onChange={change} placeholder="Your name" maxLength={60} aria-invalid={Boolean(errors.author)} />{errors.author && <span className="field-error">{errors.author}</span>}</div>
            <div className="field"><label htmlFor="category">Category <span>*</span></label><select id="category" name="category" value={form.category} onChange={change}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
          </div>
        </div>

        <div className="form-panel">
          <div className="form-section-heading"><span className="form-step">02</span><div><h2>The story itself</h2><p>Write something useful, personal, or unexpected.</p></div></div>
          <div className="field"><label htmlFor="content">Your article <span>*</span></label><textarea id="content" name="content" value={form.content} onChange={change} placeholder={"Start writing here...\n\nUse a blank line to start a new paragraph."} rows={12} aria-invalid={Boolean(errors.content)} />{errors.content && <span className="field-error">{errors.content}</span>}<span className="field-hint">{form.content.trim() ? form.content.trim().split(/\s+/).length : 0} words · Estimated reading time: {Math.max(1, Math.ceil(form.content.trim().split(/\s+/).filter(Boolean).length / 200))} min</span></div>
        </div>

        <div className="form-panel">
          <div className="form-section-heading"><span className="form-step">03</span><div><h2>Make it yours</h2><p>Add a cover image and a few helpful tags.</p></div></div>
          <div className="field"><label htmlFor="cover">Cover image URL</label><div className="input-with-icon"><ImagePlus size={17} /><input id="cover" name="cover" value={form.cover} onChange={change} placeholder="https://example.com/your-image.jpg" aria-invalid={Boolean(errors.cover)} /></div>{errors.cover && <span className="field-error">{errors.cover}</span>}<span className="field-hint">Optional. Use a publicly accessible image URL.</span>{form.cover && /^https?:\/\/\S+/i.test(form.cover) && <img className="cover-preview" src={form.cover} alt="Cover preview" onError={(event) => { event.currentTarget.style.display = "none"; }} onLoad={(event) => { event.currentTarget.style.display = "block"; }} />}</div>
          <div className="field"><label htmlFor="tags">Tags</label><input id="tags" name="tags" value={form.tags} onChange={change} placeholder="e.g. learning, creativity, habits" /><span className="field-hint">Separate tags with commas.</span></div>
        </div>

        <div className="editor-submit-row"><p><span>*</span> Required fields. Your posts are saved in this browser.</p><div><Link className="button button-secondary" to={editing ? `/blog/${id}` : "/"}>Cancel</Link><button className="button button-primary" type="submit"><Save size={16} /> {editing ? "Save changes" : "Publish story"}</button></div></div>
      </form>
    </main>
  );
}