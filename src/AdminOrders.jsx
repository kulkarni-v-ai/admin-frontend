import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("https://shop-backend-yvk4.onrender.com/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(
        `https://shop-backend-yvk4.onrender.com/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const res = await fetch(
        "https://shop-backend-yvk4.onrender.com/api/orders"
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log("Update failed:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 15,
          }}
        >
          <p>
            <b>Total:</b> ₹{order.total}
          </p>

          <p>
            <b>Status:</b>
          </p>

          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
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