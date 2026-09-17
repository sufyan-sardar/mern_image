import { Edit3, ImageOff, Trash2 } from "lucide-react";

function ImageList({ images, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
        <p>Loading your images...</p>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="empty-state">
        <ImageOff size={42} />
        <h3>No images yet</h3>
        <p>Upload your first image using the form.</p>
      </div>
    );
  }

  return (
    <div className="image-grid">
      {images.map((image) => (
        <article className="image-card" key={image._id}>
          <div className="image-wrapper">
            <img
              src={image.imageUrl}
              alt={image.title}
              loading="lazy"
            />
          </div>

          <div className="image-content">
            <div className="image-title-row">
              <h3 title={image.title}>{image.title}</h3>
            </div>

            {image.description && <p>{image.description}</p>}

            <div className="card-footer">
              <span>
                {new Date(image.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>

              <div className="card-actions">
                <button
                  className="icon-btn edit"
                  title="Edit image"
                  onClick={() => onEdit(image)}
                >
                  <Edit3 size={17} />
                </button>
                <button
                  className="icon-btn delete"
                  title="Delete image"
                  onClick={() => onDelete(image)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ImageList;