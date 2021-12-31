import axios from "axios";

const API_URL = process.env.REACT_APP_API_AUTH;

class AuthService {
	login(values) {
		return axios.post(API_URL + "login", values).then((response) => {
			if (response.data.accessToken) {
				sessionStorage.setItem("user", JSON.stringify(response.data));
			}

			return response;
		});
	}

	logout() {
		sessionStorage.removeItem("user");
	}

	register(values) {
		return axios.post(API_URL + "register", values);
	}

	getCurrentUser() {
		return JSON.parse(sessionStorage.getItem("user"));
	}
}

export default new AuthService();
