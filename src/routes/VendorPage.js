import React, { useState, useEffect } from "react";
import {
	Box,
	Fab,
	Typography,
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	ToggleButtonGroup,
	ToggleButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import cafeService from "../services/cafe.service";
import VendorDialog from "../components/VendorDialog";

export default function VendorPage() {
	const [vendors, setVendors] = useState({ rows: [], data: [] });

	const fetchVendors = async () => {
		const data = await cafeService.getVendor();
		const rows = data.map((vendor, index) => {
			return {
				index: index,
				name: vendor.name,
				billerId: vendor.billerId,
				address:
					vendor.address +
					" " +
					vendor.subDistrict +
					" " +
					vendor.district +
					" " +
					vendor.province +
					" " +
					vendor.zipcode,
			};
		});
		setVendors({ rows: rows, data: data });
	};

	useEffect(() => {
		fetchVendors();
	}, [vendors]);

	const [dialog, setDialog] = useState({ state: false, content: null });

	return (
		<Box mx={2}>
			<VendorDialog
				open={dialog.state}
				values={dialog.content}
				handleClose={() => {
					setDialog({ ...dialog, state: false });
				}}
			/>

			<Box mb={2} display={"flex"} justifyContent={"end"}>
				<Fab
					color='primary'
					aria-label='add'
					onClick={() => {
						setDialog({ state: true, content: null });
					}}>
					<AddIcon />
				</Fab>
			</Box>

			<TableContainer component={Paper}>
				<Table sx={{ minWidth: "60ch" }} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Vendor</TableCell>
							<TableCell>Biller ID</TableCell>
							<TableCell>Address</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{vendors.rows.map((row) => (
							<TableRow
								key={"tableRow" + row.index}
								hover={true}
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0,
									},
								}}
								onClick={() => {
									setDialog({
										state: true,
										content: vendors.data[row.index],
									});
								}}>
								<TableCell component='th' scope='row'>
									{row.name}
								</TableCell>
								<TableCell>{row.billerId}</TableCell>
								<TableCell>{row.address}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
