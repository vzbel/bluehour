import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import HeroPage from "./pages/HeroPage.jsx";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Outlet } from "react-router";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2a7af1",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  );
}

export default App;
