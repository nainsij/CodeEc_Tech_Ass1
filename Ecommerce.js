// src/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Update to your backend URL if deployed
});

export default instance;

// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<CheckoutSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;

// src/pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`/products?search=${search}`).then(res => setProducts(res.data));
  }, [search]);

  return (
    <div>
      <h1>Product Listings</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div>
        {products.map(product => (
          <Link key={product._id} to={`/product/${product._id}`}>
            <div>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;

// src/pages/Login.js
import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;

// src/pages/Register.js
import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;

// src/pages/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/products`).then(res => {
      const found = res.data.find(p => String(p._id) === String(id));
      setProduct(found);
    });
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductDetail;

// src/pages/Cart.js
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

function Cart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const res = await axios.post("/checkout", { items: cart });
    window.location = res.data.url;
  };

  return (
    <div>
      <h2>Cart</h2>
      {cart.map((item, idx) => (
        <div key={idx}>
          <p>{item.name} x {item.quantity} - ${item.price}</p>
        </div>
      ))}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default Cart;

// src/pages/CheckoutSuccess.js
import React from "react";

function CheckoutSuccess() {
  return (
    <div>
      <h2>Thank you for your purchase!</h2>
    </div>
  );
}

export default CheckoutSuccess;
