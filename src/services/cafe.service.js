import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_CAFE;

class CafeService {
	getPublicContent() {
		return axios.get(API_URL + "all");
	}

	getUserBoard() {
		return axios.get(API_URL + "user", { headers: authHeader() });
	}

	getModeratorBoard() {
		return axios.get(API_URL + "mod", { headers: authHeader() });
	}

	getAdminBoard() {
		return axios.get(API_URL + "admin", { headers: authHeader() });
	}

	getIngredient() {
		return axios
			.get(API_URL + "ingredient", { headers: authHeader() })
			.then((res) => {
				return res.data.ingredients;
			});
	}

	postIngredient(action, filter, value) {
		return axios.post(
			API_URL + "ingredient",
			{
				action,
				filter,
				value,
			},
			{
				headers: authHeader(),
			}
		);
	}

	getVendor() {
		return axios
			.get(API_URL + "vendor", { headers: authHeader() })
			.then((res) => {
				return res.data.vendors;
			});
	}

	postVendor(action, filter, value) {
		return axios.post(
			API_URL + "vendor",
			{
				action,
				filter,
				value,
			},
			{
				headers: authHeader(),
			}
		);
	}
}

export default new CafeService();
