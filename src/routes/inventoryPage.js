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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import cafeService from "../services/cafe.service";
import InventoryDialog from "../components/InventoryDialog";

export default function InventoryPage() {
	const [ingredients, setIngredients] = useState({ rows: [], data: [] });

	const fetchIngredients = async () => {
		const data = await cafeService.getIngredient();
		const rows = data.map((ingredient, index) => {
			return {
				index: index,
				name: ingredient.name,
				qtyPerUnit:
					ingredient.qtyPerUnit.toString() + " " + ingredient.qtyName,
				qty: ingredient.qty.toString() + " " + ingredient.qtyName,
				numberOfUnit: (
					ingredient.qty / ingredient.qtyPerUnit
				).toString(),
			};
		});
		setIngredients({ rows: rows, data: data });
	};

	useEffect(() => {
		fetchIngredients();
	}, [ingredients]);

	const [dialog, setDialog] = useState({ state: false, content: null });

	return (
		<Box mx={2}>
			<InventoryDialog
				open={dialog.state}
				values={dialog.content}
				handleClose={() => {
					setDialog({ ...dialog, state: false });
				}}
			/>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Ingredient</TableCell>
							<TableCell>QTY/Unit</TableCell>
							<TableCell align='right'>Remaining QTY</TableCell>
							<TableCell align='right'>Number of Unit</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{ingredients.rows.map((row) => (
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
										content: ingredients.data[row.index],
									});
								}}>
								<TableCell component='th' scope='row'>
									{row.name}
								</TableCell>
								<TableCell>
									<Typography fontStyle='italic'>
										{row.qtyPerUnit}
									</Typography>
								</TableCell>
								<TableCell align='right'>
									<Typography>{row.qty}</Typography>
								</TableCell>
								<TableCell align='right'>
									<Typography>{row.numberOfUnit}</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Box my={2}>
				<Fab
					color='primary'
					aria-label='add'
					onClick={() => {
						setDialog({ state: true, content: null });
					}}>
					<AddIcon />
				</Fab>
			</Box>
		</Box>
	);
}
