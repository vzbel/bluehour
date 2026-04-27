import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "../../client.js";

// Homepage navigation bar
const HeroNav = () => {
  const [userSession, setUserSession] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(menuAnchor);

  // Check if the user is logged in
  useEffect(() => {
    let ignore = false;
    const getUserSession = async () => {
      if (!ignore) {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setUserSession(null);
        } else {
          setUserSession(data.session);
        }
      }
    };

    getUserSession();

    return () => {
      ignore = true;
    };
  }, []);

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    setUserSession(null);
  };

  // Listen for auth changes
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      setUserSession(session);
    }
  });

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
            {userSession ? (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
              >
                Log Out
              </MenuItem>
            ) : (
              [
                <Link
                  key="login"
                  to="/login"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem onClick={handleMenuClose}>Log In</MenuItem>
                </Link>,
                <Link
                  key="signup"
                  to="/signup"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem onClick={handleMenuClose}>Sign Up</MenuItem>
                </Link>,
              ]
            )}
          </Menu>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: { xs: "none", sm: "flex" },
              flexGrow: 1,
              fontFamily: "monospace",
            }}
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
              fontFamily: "monospace",
            }}
          >
            bluehour
          </Typography>

          {userSession ? (
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleLogout}
              sx={{ display: { xs: "none", sm: "block" }, mr: 0 }}
            >
              Log Out
            </Button>
          ) : (
            <>
              {/* Log In */}
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "white" }}
              >
                <Button
                  color="inherit"
                  variant="outlined"
                  sx={{ display: { xs: "none", sm: "block" }, mr: 2 }}
                >
                  Log In
                </Button>
              </Link>

              {/* Sign Up */}
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "white" }}
              >
                <Button
                  color="inherit"
                  variant="text"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeroNav;
