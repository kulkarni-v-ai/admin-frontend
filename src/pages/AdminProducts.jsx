import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiExternalLink, FiImage, FiUpload } from "react-icons/fi";

function AdminProducts() {
  const { hasRole } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [editingProductId, setEditingProductId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("General");

  // Multi-image state
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // URLs from server

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProductId(null);
    setName("");
    setPrice("");
    setDescription("");
    setStock("");
    setCategory("General");
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setExistingImages([]);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProductId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description || "");
    setStock(product.stock);
    setCategory(product.category || "General");
    setNewImageFiles([]);
    setNewImagePreviews([]);
    // Load existing images from server
    const imgs = product.images && product.images.length > 0
      ? product.images
      : product.image ? [product.image] : [];
    setExistingImages(imgs);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Handle new file selection (append to list)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImageFiles.length + files.length;
    if (totalImages > 5) {
      setError("Maximum 5 images allowed per product.");
      return;
    }

    const updatedFiles = [...newImageFiles, ...files];
    setNewImageFiles(updatedFiles);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);

    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  // Remove an existing (server) image
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove a new (not yet uploaded) image
  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("category", category);

    // Append new image files
    newImageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // For edit mode, send existing images that the user wants to keep
    if (editingProductId) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      closeModal();
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    }
  };

  // Roles mapped to capabilities
  const canAddEdit = hasRole(["superadmin", "admin", "manager"]);
  const canDelete = hasRole(["superadmin"]);

  // Get product display image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return null;
  };

  const totalImages = existingImages.length + newImageFiles.length;

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading products...</div>;
  }

  return (
    <div>
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "24px", fontWeight: "700" }}>Products Catalog</h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>{products.length} products in inventory</p>
        </div>
        {canAddEdit && (
          <button
            onClick={openAddModal}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 20px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white",
              border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)", transition: "all 0.2s"
            }}
          >
            <FiPlus /> Add Product
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "10px", marginBottom: "20px", border: "1px solid rgba(239, 68, 68, 0.2)", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Grid Layout for Products */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px"
      }}>
        {products.map((product) => {
          const displayImage = getProductImage(product);
          const imageCount = product.images ? product.images.length : (product.image ? 1 : 0);

          return (
            <div key={product._id} style={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}>
              {/* Image */}
              <div style={{ height: "180px", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", position: "relative" }}>
                {displayImage ? (
                  <img src={displayImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <FiImage size={32} style={{ color: "#334155" }} />
                )}
                {imageCount > 1 && (
                  <div style={{
                    position: "absolute", top: "8px", right: "8px",
                    backgroundColor: "rgba(0,0,0,0.7)", color: "#e2e8f0",
                    padding: "3px 8px", borderRadius: "12px", fontSize: "11px",
                    fontWeight: "600", backdropFilter: "blur(8px)"
                  }}>
                    <FiImage size={10} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                    {imageCount}
                  </div>
                )}
              </div>

              <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#f1f5f9", fontWeight: "600" }}>{product.name}</h3>
                  <span style={{ fontWeight: "700", color: "#10b981", fontSize: "15px", whiteSpace: "nowrap" }}>₹{product.price}</span>
                </div>

                <div style={{ fontSize: "12px", marginBottom: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", color: "#818cf8", padding: "3px 10px", borderRadius: "20px", fontWeight: "500" }}>{product.category}</span>
                  <span style={{
                    backgroundColor: product.stock > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    color: product.stock > 0 ? "#10b981" : "#ef4444",
                    padding: "3px 10px", borderRadius: "20px", fontWeight: "600"
                  }}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5" }}>
                  {product.description}
                </p>

                {/* Card Actions */}
                <div style={{ display: "flex", gap: "8px", marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                  {canAddEdit && (
                    <button
                      onClick={() => openEditModal(product)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", backgroundColor: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "8px", color: "#818cf8", cursor: "pointer", fontWeight: "500", fontSize: "13px" }}
                    >
                      <FiEdit2 size={13} /> Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => deleteProduct(product._id)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#ef4444", cursor: "pointer", fontWeight: "500", fontSize: "13px" }}
                    >
                      <FiTrash2 size={13} /> Delete
                    </button>
                  )}
                  <a
                    href={`https://houseofvisuals.co.in/product/${product._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px", color: "#10b981", cursor: "pointer", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}
                    title="View on live site"
                  >
                    <FiExternalLink size={13} /> View
                  </a>
                  {!canAddEdit && !canDelete && (
                    <span style={{ color: "#475569", fontSize: "12px", width: "100%", textAlign: "center" }}>View Only</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b", backgroundColor: "#1e293b", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <FiBox size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
          <p style={{ fontSize: "16px", fontWeight: "500" }}>No products found</p>
          <p style={{ fontSize: "14px" }}>Add your first product to get started.</p>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div style={{
            backgroundColor: "#1e293b", padding: "32px", borderRadius: "16px",
            width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "20px" }}>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeModal} style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", color: "#94a3b8", padding: "8px", borderRadius: "8px", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Product name" />
              </div>

              {/* Price & Stock */}
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Price (₹)</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} placeholder="0" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Stock</label>
                  <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} style={inputStyle} placeholder="0" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, backgroundColor: "#0f172a" }}>
                  <option value="General">General</option>
                  <option value="Posters">Posters</option>
                  <option value="Stickers">Stickers</option>
                  <option value="Artifacts">Artifacts</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, fontFamily: "inherit", resize: "vertical" }} placeholder="Describe the product..." />
              </div>

              {/* Image Upload Section */}
              <div>
                <label style={labelStyle}>
                  Product Images
                  <span style={{ fontWeight: "400", color: "#64748b", marginLeft: "8px" }}>({totalImages}/5)</span>
                </label>

                {/* Existing Images (from server) */}
                {existingImages.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0" }}>Current images:</p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {existingImages.map((url, i) => (
                        <div key={`existing-${i}`} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", border: "2px solid rgba(99, 102, 241, 0.3)" }}>
                          <img src={url} alt={`Existing ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(i)}
                            style={{
                              position: "absolute", top: "2px", right: "2px",
                              background: "rgba(239, 68, 68, 0.9)", border: "none", color: "white",
                              borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", padding: 0
                            }}
                          >
                            <FiX size={12} />
                          </button>
                          {i === 0 && (
                            <div style={{
                              position: "absolute", bottom: "2px", left: "2px",
                              background: "rgba(16, 185, 129, 0.9)", color: "white",
                              fontSize: "9px", padding: "1px 5px", borderRadius: "4px", fontWeight: "700"
                            }}>MAIN</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Previews */}
                {newImagePreviews.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0" }}>New uploads:</p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {newImagePreviews.map((url, i) => (
                        <div key={`new-${i}`} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", border: "2px solid rgba(16, 185, 129, 0.3)" }}>
                          <img src={url} alt={`New ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            style={{
                              position: "absolute", top: "2px", right: "2px",
                              background: "rgba(239, 68, 68, 0.9)", border: "none", color: "white",
                              borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", padding: 0
                            }}
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload button */}
                {totalImages < 5 && (
                  <label style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    padding: "20px", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "12px",
                    cursor: "pointer", color: "#64748b", fontSize: "14px",
                    backgroundColor: "rgba(15, 23, 42, 0.5)", transition: "all 0.2s"
                  }}>
                    <FiUpload size={18} />
                    <span>Click to upload images ({5 - totalImages} remaining)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                )}

                {editingProductId && totalImages === 0 && (
                  <p style={{ fontSize: "12px", color: "#f59e0b", margin: "8px 0 0 0" }}>⚠ No images — product will show without an image.</p>
                )}
              </div>

              {/* Form Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px", justifyContent: "flex-end" }}>
                <button type="button" onClick={closeModal} style={{
                  padding: "10px 20px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", cursor: "pointer", color: "#94a3b8", fontWeight: "500", fontSize: "14px"
                }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{
                  padding: "10px 24px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none",
                  borderRadius: "10px", cursor: isSubmitting ? "not-allowed" : "pointer", color: "white",
                  fontWeight: "600", fontSize: "14px", opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                }}>
                  {isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared styles
const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#94a3b8",
  letterSpacing: "0.02em"
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.08)",
  boxSizing: "border-box",
  backgroundColor: "#0f172a",
  color: "#e2e8f0",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s"
};

export default AdminProducts;