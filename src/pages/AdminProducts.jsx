import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

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
  const [imageFile, setImageFile] = useState(null);

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
    setImageFile(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProductId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setStock(product.stock);
    setCategory(product.category);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
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

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingProductId) {
        // Edit mode
        await api.put(`/products/${editingProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // Add mode
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

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading products...</div>;
  }

  return (
    <div>
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#111827" }}>Products Catalog</h2>
        {canAddEdit && (
          <button
            onClick={openAddModal}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 16px", backgroundColor: "#3b82f6", color: "white",
              border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500"
            }}
          >
            <FiPlus /> Add Product
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Grid Layout for Products */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {products.map((product) => (
          <div key={product._id} style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}>
            {/* Image Placeholder */}
            <div style={{ height: "150px", backgroundColor: "#f3f4f6", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "#9ca3af" }}>No Image</span>
              )}
            </div>

            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#111827" }}>{product.name}</h3>
                <span style={{ fontWeight: "bold", color: "#059669", fontSize: "16px" }}>₹{product.price}</span>
              </div>

              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "15px", display: "flex", gap: "10px" }}>
                <span style={{ backgroundColor: "#e5e7eb", padding: "2px 8px", borderRadius: "10px" }}>{product.category}</span>
                <span style={{ color: product.stock > 0 ? "#059669" : "#dc2626", fontWeight: "500" }}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 20px 0", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {product.description}
              </p>

              {/* Card Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "auto", borderTop: "1px solid #f3f4f6", paddingTop: "15px" }}>
                {canAddEdit && (
                  <button
                    onClick={() => openEditModal(product)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", backgroundColor: "#f3f4f6", border: "none", borderRadius: "4px", color: "#374151", cursor: "pointer" }}
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => deleteProduct(product._id)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", backgroundColor: "#fee2e2", border: "none", borderRadius: "4px", color: "#dc2626", cursor: "pointer" }}
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                )}
                {!canAddEdit && !canDelete && (
                  <span style={{ color: "#9ca3af", fontSize: "12px", width: "100%", textAlign: "center" }}>View Only</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
          No products found. Add your first product.
        </div>
      )}

      {/* Basic Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "30px", borderRadius: "8px",
            width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280" }}>
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Price (₹)</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Stock</label>
                  <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: "white" }}>
                  <option value="General">General</option>
                  <option value="Posters">Posters</option>
                  <option value="Stickers">Stickers</option>
                  <option value="Artifacts">Artifacts</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Description</label>
                <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Product Image</label>
                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} style={{ width: "100%", padding: "8px", border: "1px dashed #d1d5db", borderRadius: "4px", boxSizing: "border-box" }} />
                {editingProductId && <p style={{ fontSize: "12px", color: "#6b7280", margin: "5px 0 0 0" }}>Leave empty to keep current image.</p>}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={closeModal} style={{ padding: "10px 16px", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", color: "#374151", fontWeight: "500" }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: "10px 16px", backgroundColor: "#3b82f6", border: "none", borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer", color: "white", fontWeight: "500", opacity: isSubmitting ? 0.7 : 1 }}>
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

export default AdminProducts;