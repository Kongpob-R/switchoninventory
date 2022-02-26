import axios from "axios";
import app from "../firebase-config";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";

const API_URL = process.env.REACT_APP_API_AUTH;
const authentication = getAuth();

class AuthService {
	login(values) {
		signInWithEmailAndPassword(
			authentication,
			values.email,
			values.password
		).then((response) => {
			sessionStorage.setItem(
				"user",
				JSON.stringify(response._tokenResponse)
			);
		});
		// return axios.post(API_URL + "login", values).then((response) => {
		// 	if (response.data.accessToken) {
		// 		sessionStorage.setItem("user", JSON.stringify(response.data));
		// 	}

		// 	return response;
		// });
	}

	logout() {
		signOut(authentication);
		sessionStorage.removeItem("user");
	}

	register(values) {
		createUserWithEmailAndPassword(
			authentication,
			values.email,
			values.password
		).then((response) => {});
		// return axios.post(API_URL + "register", values);
	}

	getCurrentUser() {
		return JSON.parse(sessionStorage.getItem("user"));
	}
}

export default new AuthService();
