import HeroNav from "../components/hero/HeroNav.jsx";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import { supabase } from "../client.js";
import { useState } from "react";

const formImage = {
  url: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "A cityscape",
};

const SignUpPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    handle: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Make the account and profile
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    const { error: profileError } = await supabase
      .from("Profiles")
      .insert({ user_id: data.user.id, handle: user.handle });
    setLoading(false);

    // Show error alert for a short time
    if (signUpError || profileError) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  // Update the email or password when the user types into the field
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
        onSubmit={handleSignUp}
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
          Sign Up
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

        {/* Handle */}
        <TextField
          label="Handle"
          name="handle"
          value={user.handle}
          onChange={handleFormChange}
          type="text"
          variant="outlined"
          placeholder="janedoe"
          required={true}
          aria-required={true}
          sx={{ mb: 2, width: 1 }}
        >
          Handle
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
          Sign Up
        </Button>

        {/* Show error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            Error signing up
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default SignUpPage;
