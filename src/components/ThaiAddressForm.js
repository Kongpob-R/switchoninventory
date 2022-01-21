import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import {
	TextField,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
} from "@mui/material";
import {
	searchAddressByDistrict,
	searchAddressByAmphoe,
	searchAddressByProvince,
	searchAddressByZipcode,
} from "thai-address-database";

export default function ThaiAddressForm(props) {
	const [addresses, setAddresses] = useState([]);
	const [focusField, setFocusField] = useState();

	useEffect(() => {
		switch (focusField) {
			case "subDistrict":
				setAddresses(
					searchAddressByDistrict(props.formik.values.subDistrict)
				);
				break;
			case "district":
				setAddresses(
					searchAddressByAmphoe(props.formik.values.district)
				);
				break;
			case "province":
				setAddresses(
					searchAddressByProvince(props.formik.values.province)
				);
				break;
			case "zipcode":
				setAddresses(
					searchAddressByAmphoe(props.formik.values.zipcode)
				);
				break;
			default:
				setFocusField(false);
		}
	}, [props.formik.values]);

	const fillAddress = (value) => {
		if (value) {
			props.formik.values.subDistrict = value.district;
			props.formik.values.district = value.amphoe;
			props.formik.values.province = value.province;
			props.formik.values.zipcode = value.zipcode;
			setAddresses([]);
		}
	};

	return (
		<Box
			sx={{
				"& > :not(style)": { m: 1 },
			}}
			autoComplete='off'>
			<TextField
				sx={{ width: "60ch" }}
				id='address'
				label='address'
				type='text'
				variant='outlined'
				value={props.formik.values.address}
				onChange={props.formik.handleChange}
			/>

			<TextField
				sx={{ width: "29ch" }}
				id='subDistrict'
				label='sub district'
				type='text'
				variant='outlined'
				value={props.formik.values.subDistrict}
				onChange={props.formik.handleChange}
				onFocus={() => {
					setFocusField("subDistrict");
				}}
			/>

			<TextField
				sx={{ width: "29ch" }}
				id='district'
				label='district'
				type='text'
				variant='outlined'
				value={props.formik.values.district}
				onChange={props.formik.handleChange}
				onFocus={() => {
					setFocusField("district");
				}}
			/>

			<TextField
				sx={{ width: "29ch" }}
				id='province'
				label='province'
				type='text'
				variant='outlined'
				value={props.formik.values.province}
				onChange={props.formik.handleChange}
				onFocus={() => {
					setFocusField("province");
				}}
			/>

			<TextField
				sx={{ width: "29ch" }}
				id='zipcode'
				label='zipcode'
				type='text'
				variant='outlined'
				value={props.formik.values.zipcode}
				onChange={props.formik.handleChange}
				onFocus={() => {
					setFocusField("zipcode");
				}}
			/>

			<TableContainer component={Paper}>
				<Table
					sx={{ minWidth: 650 }}
					size='small'
					aria-label='address suggestion table'>
					<TableBody>
						{addresses.map((row, index) => (
							<TableRow
								key={"suggestionAddress" + index}
								hover={true}
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0,
									},
								}}
								onClick={() => {
									fillAddress(row);
								}}>
								<TableCell component='th' scope='row'>
									{row.district} | {row.amphoe} |{" "}
									{row.province} | {row.zipcode}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
