import React from "react";
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
import axios from "axios";

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
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			action: "login",
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			if (values.action === "register")
				axios.post(process.env.REACT_APP_API_REGISTER, values);
			else axios.post(process.env.REACT_APP_API_LOGIN, values);
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
