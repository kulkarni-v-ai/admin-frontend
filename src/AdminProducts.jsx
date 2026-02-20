import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://shop-backend-yvk4.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

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