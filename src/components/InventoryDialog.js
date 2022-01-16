import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { Box } from "@mui/system";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import cafeService from "../services/cafe.service";

const catagoryList = [
	"flavor syrup",
	"milk product",
	"dry ingredient",
	"utensil",
];

export default function InventoryDialog(props) {
	const [vendors, setVendors] = useState([]);

	const fetchVendors = async () => {
		const vendors = await cafeService.getVendor();
		setVendors(vendors);
	};

	useEffect(() => {
		fetchVendors();
	}, []);

	const formik = useFormik({
		initialValues: props.values
			? props.values
			: {
					name: "",
					catagory: "",
					qtyPerUnit: 0,
					qtyName: "",
					qty: 0,
					cost: 0,
					vendor_id: "",
			  },
		enableReinitialize: true,
		onSubmit: (values) => {
			if (props.values) {
				cafeService.postIngredient(
					"update",
					{ _id: props.values._id },
					values
				);
			} else {
				cafeService.postIngredient("create", {}, values);
			}
		},
	});

	return (
		<Dialog open={props.open} onClose={props.handleClose}>
			<DialogTitle>
				{props.values ? "Edit" : "Create"} Ingredient
			</DialogTitle>

			<form id='ingredientForm' onSubmit={formik.handleSubmit}>
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

						<FormControl sx={{ minWidth: "29ch" }}>
							<InputLabel id='catagoryLabel'>catagory</InputLabel>
							<Select
								labelId='catagoryLabel'
								id='catagory'
								label='catagory'
								value={formik.values.catagory}
								onChange={(e) =>
									(formik.values.catagory = e.target.value)
								}>
								<MenuItem value={""}>
									<em>None</em>
								</MenuItem>
								{catagoryList.map((catagory) => {
									return (
										<MenuItem
											value={catagory}
											key={catagory}>
											{catagory}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>

						<TextField
							sx={{ width: "29ch" }}
							id='qtyPerUnit'
							label='qtyPerUnit'
							type='number'
							variant='outlined'
							value={formik.values.qtyPerUnit}
							onChange={formik.handleChange}
						/>
						<TextField
							sx={{ width: "29ch" }}
							id='qtyName'
							label='qtyName'
							type='text'
							variant='outlined'
							value={formik.values.qtyName}
							onChange={formik.handleChange}
						/>
						<TextField
							sx={{ width: "29ch" }}
							id='qty'
							label='qtyRemaining'
							type='number'
							variant='outlined'
							value={formik.values.qty}
							onChange={formik.handleChange}
						/>
						<TextField
							sx={{ width: "29ch" }}
							id='cost'
							label='costPerUnit'
							type='number'
							variant='outlined'
							value={formik.values.cost}
							onChange={formik.handleChange}
						/>
						<FormControl sx={{ minWidth: "60ch" }}>
							<InputLabel id='vendorIdLabel'>vendor</InputLabel>
							<Select
								labelId='vendorIdlabel'
								id='vendorId'
								label='vendor'
								value={formik.values.vendor_id}
								onChange={(e) =>
									(formik.values.vendor_id = e.target.value)
								}>
								<MenuItem value={""}>
									<em>None</em>
								</MenuItem>
								{vendors.map((vendor) => {
									return (
										<MenuItem
											value={vendor._id}
											key={vendor._id}>
											{vendor.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button onClick={props.handleClose}>Cancel</Button>
					<Button
						onClick={() => {
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
