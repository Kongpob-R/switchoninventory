const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Please enter an email"],
		unique: true,
		lowercase: true,
		validate: [isEmail, "Please enter a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please enter a password"],
		minlength: [8, "Minimum password length is 8 characters"],
	},
	role: {
		type: String,
	},
});

userSchema.pre("save", function (next) {
	var user = this;
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const isAdmit = user.role === "admin" ? true : false;
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			if (isAdmit) {
				return user;
			}
			throw Error("your role is not admin");
		}
		throw Error("incorrect password");
	}
	throw Error("incorrect email");
};

var User = mongoose.model("User", userSchema);

module.exports = User;
