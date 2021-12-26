import "./App.css";
import AuthCard from "./components/AuthCard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import InventoryPage from "./routes/InventoryPage";
import PersistentDrawerLeft from "./components/AppDrawer";

function App() {
	const [user, setUser] = useState({});
	return (
		<div className='App'>
			<BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
				<PersistentDrawerLeft />
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
