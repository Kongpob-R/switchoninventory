export default function authHeader() {
	const user = JSON.parse(sessionStorage.getItem("user"));

	if (user && user.accessToken) {
		// for Node.js Express back-end
		return { "x-access-token": user.idToken };
	} else {
		return {};
	}
}
