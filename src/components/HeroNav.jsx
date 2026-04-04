import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";

import { useState } from "react";

// Homepage navigation bar
const HeroNav = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(menuAnchor);

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {/* Menu and Logo */}
          <IconButton
            color="inherit"
            sx={{ mr: { xs: 0, sm: 2 }, display: { xs: "flex", sm: "none" } }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            open={isMenuOpen}
            anchorEl={menuAnchor}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Log In</MenuItem>
            <MenuItem onClick={handleMenuClose}>Sign Up</MenuItem>
          </Menu>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "none", sm: "flex" }, flexGrow: 1 }}
          >
            bluehour
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: { xs: "flex", sm: "none" },
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            bluehour
          </Typography>

          {/* Log In */}
          <Button
            color="inherit"
            variant="outlined"
            sx={{ display: { xs: "none", sm: "block" }, mr: 2 }}
          >
            Log In
          </Button>

          {/* Sign Up */}
          <Button
            color="inherit"
            variant="text"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeroNav;
