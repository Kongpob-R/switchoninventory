import React, { useState } from "react";
import { useFormik } from "formik";
import {
	Grid,
	TextField,
	Box,
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
} from "@mui/material";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const validationSchema = yup.object({
	email: yup
		.string("Enter your email")
		.email("Enter a valid email")
		.required("Email is required"),
	password: yup
		.string("Enter your password")
		.min(8, "Password should be of minimum 8 characters length")
		.required("Password is required"),
});

export default function AuthCard() {
	let navigate = useNavigate();
	const [resMessage, setResMessage] = useState({});

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			action: "login",
		},
		validationSchema: validationSchema,
		handleChange: () => {
			setResMessage({});
		},
		onSubmit: (values) => {
			if (values.action === "register")
				AuthService.register(values)
					.then((res) => {
						setResMessage({
							color: "green",
							text: res.data.message,
						});
					})
					.catch(() => {
						setResMessage({
							color: "red",
							text: "email already exists or some field are missing",
						});
					});
			else
				AuthService.login(values)
					.then((res) => {
						if (res.data) {
							setResMessage({ color: "green", text: "Success" });
							navigate("/inventory");
						}
					})
					.catch((err) => {
						if (err.response) {
							setResMessage({
								color: "red",
								text: err.response.data.errors,
							});
						}
					});
			// alert(JSON.stringify(values));
		},
	});

	return (
		<Box pt={10}>
			<Grid
				container
				spacing={0}
				direction='column'
				alignItems='center'
				justify='center'
				style={{ minHeight: "100vh" }}>
				<form id='authenticationForm' onSubmit={formik.handleSubmit}>
					<Card variant='outlined' sx={{ minWidth: 350 }}>
						<CardContent>
							<Typography
								sx={{ fontSize: 18 }}
								color='text.primary'
								gutterBottom>
								Authentication
							</Typography>

							<TextField
								fullWidth
								margin='normal'
								id='email'
								name='email'
								label='Email'
								variant='standard'
								value={formik.values.email}
								onChange={formik.handleChange}
								error={
									formik.touched.email &&
									Boolean(formik.errors.email)
								}
								helperText={
									formik.touched.email && formik.errors.email
								}
							/>
							<br />

							<TextField
								fullWidth
								margin='normal'
								id='password'
								name='password'
								label='Password'
								variant='standard'
								type='password'
								value={formik.values.password}
								onChange={formik.handleChange}
								error={
									formik.touched.password &&
									Boolean(formik.errors.password)
								}
								helperText={
									formik.touched.password &&
									formik.errors.password
								}
							/>
							<Typography
								sx={{ fontSize: 14 }}
								color={resMessage.color || "text.secondary"}
								gutterBottom>
								{resMessage.text}
							</Typography>
						</CardContent>

						<CardActions>
							<Grid
								item
								container
								justifyContent={"space-between"}>
								<Grid item>
									<Button
										onClick={() => {
											formik.values.action = "register";
											formik.handleSubmit();
										}}>
										Register
									</Button>
								</Grid>
								<Grid item>
									<Button
										name='login'
										color='primary'
										variant='contained'
										type='submit'
										onClick={() => {
											formik.values.action = "login";
										}}>
										Login
									</Button>
								</Grid>
							</Grid>
						</CardActions>
					</Card>
				</form>
			</Grid>
		</Box>
	);
}
