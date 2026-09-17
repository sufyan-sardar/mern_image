import { useEffect, useRef, useState } from "react";
import { ImagePlus, RotateCcw, UploadCloud } from "lucide-react";

function ImageForm({ editingImage, onSaved, onCancel, saveImage }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingImage) {
      setTitle(editingImage.title || "");
      setDescription(editingImage.description || "");
      setPreview(editingImage.imageUrl || "");
      setFile(null);
    } else {
      reset();
    }
    setError("");
  }, [editingImage]);

  function reset() {
    setTitle("");
    setDescription("");
    setFile(null);
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!editingImage && !file) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (file) formData.append("image", file);

    try {
      setSaving(true);
      await saveImage(formData, editingImage?._id);
      reset();
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="form-card">
      <div className="section-heading">
        <div className="icon-box">
          <ImagePlus size={20} />
        </div>
        <div>
          <h2>{editingImage ? "Edit image" : "Add new image"}</h2>
          <p>{editingImage ? "Update the image details." : "Upload an image with a title and description."}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="field-label">Title *</label>
        <input
          className="text-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sunset at the beach"
          maxLength={120}
        />

        <label className="field-label">Description</label>
        <textarea
          className="text-input textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short description..."
          rows="4"
          maxLength={500}
        />

        <label className="field-label">Image {!editingImage && "*"}</label>
        <div
          className="drop-zone"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          {preview ? (
            <img className="form-preview" src={preview} alt="Preview" />
          ) : (
            <>
              <UploadCloud size={34} />
              <strong>Choose an image</strong>
              <span>JPG, PNG, GIF or WEBP • Max 5MB</span>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          hidden
        />

        {file && <p className="file-name">{file.name}</p>}
        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          {editingImage && (
            <button type="button" className="btn secondary" onClick={onCancel}>
              <RotateCcw size={17} /> Cancel
            </button>
          )}
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Saving..." : editingImage ? "Update image" : "Upload image"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ImageForm;