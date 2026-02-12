
import { useEffect, useState } from "react";



function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [image, setImage] = useState(null);
const [description, setDescription] = useState("");
const [stock, setStock] = useState("");
const [editingId, setEditingId] = useState(null);
const [editData, setEditData] = useState({});


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

const startEdit = (product) => {
  setEditingId(product._id);
  setEditData(product);
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

const saveEdit = async () => {
  try {
    await fetch(`https://shop-backend-yvk4.onrender.com/api/products/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    });

    const res = await fetch("https://shop-backend-yvk4.onrender.com/api/products");
    const data = await res.json();
    setProducts(data);

    setEditingId(null);
  } catch (err) {
    console.log(err);
  }
};


const createProduct = async () => {
  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("image", image);   // ← actual file

    await fetch("https://shop-backend-yvk4.onrender.com/api/products", {
      method: "POST",
      body: formData,   // ⚠️ no headers here
    });

    // Refresh product list
    const res = await fetch("https://shop-backend-yvk4.onrender.com/api/products");
    const data = await res.json();
    setProducts(data);

    // Clear form
    setName("");
    setPrice("");
    setImage(null);
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
type="file"
 onChange={(e) => setImage(e.target.files[0])}
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
  <div key={p._id} style={{
  border: "1px solid #ccc",
  padding: 10,
  marginBottom: 10,
  position: "relative"
}}>

{editingId === p._id ? (
  <>
    <input
      value={editData.name}
      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
    />

    <input
      value={editData.price}
      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
    />

    <button onClick={saveEdit}>Save</button>
  </>
) : (
  <>
    <b>{p.name}</b> — ₹{p.price}

    <button
      onClick={() => startEdit(p)}
      style={{ marginLeft: 10 }}
    >
      Edit
    </button>

    <button
      onClick={() => deleteProduct(p._id)}
      style={{
        marginLeft: 10,
        background: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer"
      }}
    >
      Delete
    </button>
  </>
)}
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

