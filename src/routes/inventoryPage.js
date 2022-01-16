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
	const [ingredients, setIngredients] = useState([]);

	const fetchIngredients = async () => {
		const rows = (await cafeService.getIngredient()).map((ingredient) => {
			return {
				name: ingredient.name,
				qtyPerUnit:
					ingredient.qtyPerUnit.toString() + " " + ingredient.qtyName,
				qty: ingredient.qty.toString() + " " + ingredient.qtyName,
				numberOfUnit: ingredient.qty / ingredient.qtyPerUnit,
			};
		});
		setIngredients(rows);
	};

	useEffect(() => {
		fetchIngredients();
	}, [ingredients]);

	const [dialog, setDialog] = useState(false);

	return (
		<Box mx={2}>
			<InventoryDialog
				open={dialog}
				handleClose={() => {
					setDialog(false);
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
						{ingredients.map((row) => (
							<TableRow
								key={row.name}
								hover={true}
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0,
									},
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
						setDialog(true);
					}}>
					<AddIcon />
				</Fab>
			</Box>
		</Box>
	);
}
