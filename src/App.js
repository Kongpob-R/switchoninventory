import "./App.css";
import AuthCard from "./components/AuthCard";
import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import InventoryPage from "./routes/InventoryPage";
import PersistentDrawerLeft from "./components/AppDrawer";
import VendorPage from "./routes/VendorPage";

function App() {
	return (
		<div className='App'>
			<PersistentDrawerLeft />
			<Routes>
				<Route path='/inventory' element={<InventoryPage />} />
				<Route path='/vendor' element={<VendorPage />} />
				<Route path='/auth' element={<AuthCard />} />
			</Routes>
		</div>
	);
}

export default App;
