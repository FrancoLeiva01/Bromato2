import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes/Routes";
import { AuthProvider } from "./modules/Auth/context/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
