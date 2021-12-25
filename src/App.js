import "./App.css";
import KeyAppBar from "./components/AppBar";
import AuthCard from "./components/AuthCard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import InventoryPage from "./routes/InventoryPage";

function App() {
	const [user, setUser] = useState({});
	return (
		<div className='App'>
			<BrowserRouter basename='/cafe'>
				<KeyAppBar user={user} />
				<Routes>
					<Route path='/inventory' element={<InventoryPage />} />
					<Route
						path='/auth'
						element={<AuthCard setUser={setUser} />}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
