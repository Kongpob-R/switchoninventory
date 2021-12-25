import * as React from "react";
import { useState } from "react";
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Box,
	Button,
	Container,
	Menu,
	MenuItem,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const pages = [
	{ name: "Recipe", link: "/recipe" },
	{ name: "Inventory", link: "/inventory" },
	{ name: "Vendor", link: "/vendor" },
	{ name: "Purchase Ingredients", link: "/ingredient" },
	{ name: "Reports", link: "/reports" },
	{ name: "Banner Uploads", link: "/bannerupload" },
];

export default function KeyAppBar(props) {
	const [anchorElNav, setAnchorElNav] = useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	return (
		<AppBar position='static'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
						Switch-On
						<br />
						Coffee and Keto
					</Typography>

					<Box
						sx={{
							flexGrow: 1,
							display: { xs: "flex", md: "none" },
						}}>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: "block", md: "none" },
							}}>
							{pages.map((page) => (
								<MenuItem
									key={page.name}
									component={Link}
									to={page.link}
									onClick={handleCloseNavMenu}
									onTouchStart={handleCloseNavMenu}>
									<Typography textAlign='center'>
										{page.name}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>

					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{
							flexGrow: 1,
							display: { xs: "flex", md: "none" },
						}}>
						Switch-On Coffee and Keto
					</Typography>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: "none", md: "flex" },
						}}>
						{pages.map((page) => (
							<Button
								key={page.link}
								onClick={handleCloseNavMenu}
								sx={{
									my: 2,
									color: "white",
									display: "block",
								}}>
								{page.name}
							</Button>
						))}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
