import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./routes/Routes";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster />
                <RoutesComponent />
            </Router>
        </AuthProvider>
    );
}

export default App;
