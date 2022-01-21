import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { Box } from "@mui/system";
import cafeService from "../services/cafe.service";
import ThaiAddressForm from "./ThaiAddressForm";

export default function VendorDialog(props) {
	const [action, setAction] = useState("create");

	const formik = useFormik({
		initialValues: props.values
			? props.values
			: {
					name: "",
					billerId: "",
					address: "",
					subDistrict: "",
					district: "",
					province: "",
					zipcode: "",
			  },
		enableReinitialize: true,
		onSubmit: (values) => {
			if (action === "update") {
				cafeService.postVendor(
					"update",
					{ _id: props.values._id },
					values
				);
			} else if (action === "create") {
				cafeService.postVendor("create", {}, values).then(() => {
					formik.resetForm();
				});
			} else if (action === "delete") {
				cafeService.postVendor("delete", { _id: props.values._id }, {});
			}
		},
	});

	return (
		<Dialog open={props.open} onClose={props.handleClose}>
			<DialogTitle>{props.values ? "Edit" : "Create"} Vendor</DialogTitle>

			<form id='vendorForm' onSubmit={formik.handleSubmit}>
				<DialogContent>
					<Box
						sx={{
							"& > :not(style)": { m: 1 },
						}}
						autoComplete='off'>
						<TextField
							sx={{ width: "29ch" }}
							id='name'
							label='name'
							type='text'
							variant='outlined'
							value={formik.values.name}
							onChange={formik.handleChange}
						/>

						<TextField
							sx={{ width: "29ch" }}
							id='billerId'
							label='biller ID'
							type='text'
							variant='outlined'
							value={formik.values.billerId}
							onChange={formik.handleChange}
						/>
					</Box>
					<ThaiAddressForm formik={formik} />
				</DialogContent>

				<DialogActions>
					<Button
						variant='outlined'
						color='error'
						onClick={() => {
							setAction("delete");
							formik.handleSubmit();
							props.handleClose();
						}}>
						Delete
					</Button>
					<Button onClick={props.handleClose}>Cancel</Button>
					<Button
						variant='outlined'
						color='success'
						onClick={() => {
							props.values
								? setAction("update")
								: setAction("create");
							formik.handleSubmit();
							props.handleClose();
						}}>
						{props.values ? "Edit" : "Create"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
