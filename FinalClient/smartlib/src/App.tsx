import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading App...</div>}></Suspense>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
