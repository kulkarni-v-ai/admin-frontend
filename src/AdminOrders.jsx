
import { useEffect, useState } from "react";



function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [image, setImage] = useState("");
const [description, setDescription] = useState("");
const [stock, setStock] = useState("");

useEffect(() => {
  fetch("https://shop-backend-yvk4.onrender.com/api/orders")
    .then((res) => res.json())
    .then((data) => {
      console.log("Orders:", data);
      setOrders(data);
    })
    .catch((err) => console.log(err));
}, []);
useEffect(() => {
  fetch("https://shop-backend-yvk4.onrender.com/api/products")
    .then(res => res.json())
    .then(data => setProducts(data));
}, []);


const updateStatus = async (id, status) => {
    try {
      await fetch(`https://shop-backend-yvk4.onrender.com/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const res = await fetch("https://shop-backend-yvk4.onrender.com/api/orders");
      const data = await res.json();
      setOrders(data);

    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id) => {
  try {
    await fetch(`https://shop-backend-yvk4.onrender.com/api/products/${id}`, {
      method: "DELETE"
    });

    // Refresh product list
    const res = await fetch("https://shop-backend-yvk4.onrender.com/api/products");
    const data = await res.json();
    setProducts(data);

  } catch (err) {
    console.log(err);
  }
};

const createProduct = async () => {
  try {
    await fetch("https://shop-backend-yvk4.onrender.com/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        image,
        description,
        stock,
      }),
    });

    // Refresh list
    const res = await fetch("https://shop-backend-yvk4.onrender.com/api/products");
    const data = await res.json();
    setProducts(data);

    // Clear form
    setName("");
    setPrice("");
    setImage("");
    setDescription("");
    setStock("");

  } catch (err) {
    console.log(err);
  }
};



return (
  <div style={{ padding: 20 }}>

    <h2>Add Product</h2>

<input
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<input
  placeholder="Price"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
/>

<input
  placeholder="Image URL"
  value={image}
  onChange={(e) => setImage(e.target.value)}
/>

<input
  placeholder="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

<input
  placeholder="Stock"
  value={stock}
  onChange={(e) => setStock(e.target.value)}
/>

<button onClick={createProduct}>
  Add Product
</button>

    <h2>Products</h2>

{products.map(p => (
  <div
    key={p._id}
    style={{
      border: "1px solid #ccc",
      padding: 10,
      marginBottom: 10,
      position: "relative"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.querySelector(".delete-btn").style.opacity = 1;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.querySelector(".delete-btn").style.opacity = 0;
    }}
  >
    <b>{p.name}</b> — ₹{p.price}

    <button
      className="delete-btn"
      onClick={() => deleteProduct(p._id)}
      style={{
        position: "absolute",
        right: 10,
        top: 10,
        background: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        opacity: 0,
        transition: "0.2s"
      }}
    >
      Delete
    </button>
  </div>
))}

       


    <h2>Admin Orders</h2>

{orders.map(order => (
  <div
    key={order._id}
    style={{
      border: "1px solid #ddd",
      padding: 10,
      marginBottom: 15,
      position: "relative"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.querySelector(".status-select").style.opacity = 1;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.querySelector(".status-select").style.opacity = 0;
    }}
  >
    <p><b>Total:</b> ₹{order.total}</p>

    {/* Hidden until hover */}
    <select
      className="status-select"
      value={order.status}
      onChange={(e) =>
        updateStatus(order._id, e.target.value)
      }
      style={{
        position: "absolute",
        right: 10,
        top: 10,
        opacity: 0,
        transition: "0.2s"
      }}
    >
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>

    <ul>
      {order.items.map((item, i) => (
        <li key={i}>
          {item.name} × {item.qty}
        </li>
      ))}
    </ul>

    <small>
      {new Date(order.createdAt).toLocaleString()}
    </small>
  </div>
))}


  </div>
);
}


export default AdminOrders;

