import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("General");
  const [imageFile, setImageFile] = useState(null);

  // Load products
  useEffect(() => {
    fetch("https://shop-backend-yvk4.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  // Add product
  const addProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("image", imageFile);

    await fetch(
      "https://shop-backend-yvk4.onrender.com/api/products",
      {
        method: "POST",
        body: formData,
      }
    );

    // Reload products
    const res = await fetch(
      "https://shop-backend-yvk4.onrender.com/api/products"
    );
    const data = await res.json();
    setProducts(data);

    // Clear form
    setName("");
    setPrice("");
    setDescription("");
    setStock("");
    setCategory("General");
    setImageFile(null);
  };

  const deleteProduct = async (id) => {
    await fetch(
      `https://shop-backend-yvk4.onrender.com/api/products/${id}`,
      {
        method: "DELETE",
      }
    );

    const res = await fetch(
      "https://shop-backend-yvk4.onrender.com/api/products"
    );
    const data = await res.json();
    setProducts(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Product</h2>

      <form onSubmit={addProduct}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <br /><br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="General">General</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Electronics">Electronics</option>
        </select>
        <br /><br />

        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <br /><br />

        <button type="submit">Add Product</button>
      </form>

      <hr style={{ margin: "40px 0" }} />

      <h2>Products</h2>

      {products.map((product) => (
        <div
          key={product._id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 15,
          }}
        >
          <b>{product.name}</b> — ₹{product.price}

          <button
            style={{ marginLeft: 10 }}
            onClick={() => deleteProduct(product._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminProducts;