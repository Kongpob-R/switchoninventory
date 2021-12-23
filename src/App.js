import "./App.css";
import KeyAppBar from "./components/AppBar";
import AuthCard from "./components/AuthCard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";

function App() {
	const [user, setUser] = useState({});
	return (
		<div className='App'>
			<KeyAppBar />

			<div className='content'>
				<BrowserRouter>
					<Routes>
						<Route
							path='auth'
							element={<AuthCard setUser={setUser} />}></Route>
					</Routes>
				</BrowserRouter>
			</div>
		</div>
	);
}

export default App;
