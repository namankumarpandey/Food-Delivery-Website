import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);

  const fetchMyOrder = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/myOrderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
        }),
      });

      const data = await res.json();

      // ✅ SAFE CHECK
      if (data?.orderData?.order_data) {
        setOrders(data.orderData.order_data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container mt-5">
        {orders.length === 0 ? (
          <h4 className="text-center text-muted">No Orders Found</h4>
        ) : (
          orders
            .slice()
            .reverse()
            .map((order, index) => (
              <div key={index} className="mb-5">
                {/* ✅ Order Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-success mb-0">
                    Order Date: {new Date(order.Order_date).toLocaleString()}
                  </h5>
                  <span className="badge bg-success">
                    {order.items.length} Items
                  </span>
                </div>

                <hr />

                {/* ✅ Items Grid */}
                <div className="row g-4">
                  {order.items
                    ?.filter((item) => item)
                    .map((item, i) => (
                      <div
                        key={i}
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                      >
                        <div className="card h-100 shadow-sm border-0">
                          {/* ✅ IMAGE FIX */}
                          <img
                            src={
                              item.img
                                ? item.img
                                : "https://via.placeholder.com/300x200?text=Food"
                            }
                            className="card-img-top"
                            alt={item.name}
                            style={{
                              height: "180px",
                              objectFit: "cover",
                              borderTopLeftRadius: "10px",
                              borderTopRightRadius: "10px",
                            }}
                          />

                          <div className="card-body">
                            <h6 className="fw-bold">{item.name}</h6>

                            <p className="mb-1 text-muted">
                              Qty: {item.qty} | Size: {item.size}
                            </p>

                            <h6 className="text-success fw-bold">
                              ₹{item.price}
                            </h6>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
        )}
      </div>

      <Footer />
    </div>
  );
}
