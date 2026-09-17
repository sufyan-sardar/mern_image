import { useEffect, useMemo, useState } from "react";
import { Image, RefreshCw, Search, Sparkles } from "lucide-react";
import ImageForm from "./components/ImageForm";
import ImageList from "./components/ImageList";
import {
  createImage,
  deleteImage,
  getImages,
  updateImage
} from "./api";

function App() {
  const [images, setImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadImages(showRefresh = false) {
    try {
      setError("");
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await getImages();
      setImages(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to connect to the backend. Make sure MongoDB and the API are running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function saveImage(formData, id) {
    if (id) await updateImage(id, formData);
    else await createImage(formData);

    setNotice(id ? "Image updated successfully." : "Image uploaded successfully.");
    setEditingImage(null);
    await loadImages();
    setTimeout(() => setNotice(""), 3000);
  }

  async function handleDelete(image) {
    const confirmed = window.confirm(
      `Delete "${image.title}"? This will also remove the uploaded file.`
    );
    if (!confirmed) return;

    try {
      await deleteImage(image._id);
      setNotice("Image deleted successfully.");
      if (editingImage?._id === image._id) setEditingImage(null);
      await loadImages();
      setTimeout(() => setNotice(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete the image.");
    }
  }

  const filteredImages = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return images;

    return images.filter(
      (image) =>
        image.title.toLowerCase().includes(query) ||
        image.description.toLowerCase().includes(query)
    );
  }, [images, search]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><Image size={22} /></div>
          <div>
            <strong>ImageVault</strong>
            <span>MERN Image CRUD</span>
          </div>
        </div>

        <button
          className="refresh-btn"
          onClick={() => loadImages(true)}
          disabled={refreshing}
        >
          <RefreshCw size={17} className={refreshing ? "spin" : ""} />
          Refresh
        </button>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <div className="eyebrow"><Sparkles size={15} /> Simple image management</div>
            <h1>Manage your images <span>beautifully.</span></h1>
            <p>Upload, organize, edit and remove images from one clean dashboard.</p>
          </div>
          <div className="stat-card">
            <span>Total images</span>
            <strong>{images.length}</strong>
          </div>
        </section>

        {notice && <div className="notice">{notice}</div>}
        {error && (
          <div className="error-banner">
            <strong>Connection error:</strong> {error}
          </div>
        )}

        <div className="dashboard">
          <aside>
            <ImageForm
              editingImage={editingImage}
              saveImage={saveImage}
              onSaved={() => {}}
              onCancel={() => setEditingImage(null)}
            />
          </aside>

          <section className="gallery-section">
            <div className="gallery-header">
              <div>
                <h2>Your gallery</h2>
                <p>{filteredImages.length} {filteredImages.length === 1 ? "image" : "images"} shown</p>
              </div>

              <div className="search-box">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search images..."
                />
              </div>
            </div>

            <ImageList
              images={filteredImages}
              loading={loading}
              onEdit={setEditingImage}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>

      <footer>
        Built with React, Express, MongoDB & Multer
      </footer>
    </div>
  );
}

export default App;