import HeroNav from "../components/hero/HeroNav.jsx";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import { supabase } from "../client.js";
import { useState } from "react";
import { useNavigate } from "react-router";

const formImage = {
  url: "https://images.unsplash.com/photo-1578301996581-bf7caec556c0?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "A house in a green field",
};

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Try login
    setLoading(true);
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
    setLoading(false);

    // Display any error
    if (loginError) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    } else {
      navigate("/home");
    }
  };

  // Update email and password when typing into form
  const handleFormChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <HeroNav />
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          p: { xs: 1, sm: 3 },
          maxWidth: "600px",
          mx: "auto",
          mt: 1,
          boxShadow: "1px 2px 4px lightgrey",
        }}
      >
        {/* Main image */}
        <Box sx={{ width: 1, height: "300px", mb: 2 }}>
          <Box
            component="img"
            src={formImage.url}
            alt={formImage.alt}
            sx={{ width: 1, height: 1, objectFit: "cover" }}
          ></Box>
        </Box>

        {/* Title */}
        <Typography variant="h2" sx={{ fontSize: "2rem", mb: 2 }}>
          Log In
        </Typography>

        {/* Email */}
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleFormChange}
          type="email"
          variant="outlined"
          placeholder="johndoe@example.com"
          required={true}
          aria-required={true}
          sx={{ my: 2, width: 1 }}
        >
          Email
        </TextField>

        {/* Password */}
        <TextField
          label="Password"
          name="password"
          value={user.password}
          onChange={handleFormChange}
          variant="outlined"
          type="password"
          placeholder="***********"
          required={true}
          aria-required={true}
          sx={{ mb: 4, width: 1 }}
        >
          Email
        </TextField>

        {/* Submit Btn */}
        <Button
          type="submit"
          disabled={error || loading}
          variant="contained"
          sx={{ display: "block", width: 1 }}
          size="large"
        >
          Log In
        </Button>

        {/* Show error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            Error logging in
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
