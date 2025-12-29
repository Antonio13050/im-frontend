import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./routes/Routes";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryProvider } from "./lib/QueryProvider";

function App() {
    return (
        <QueryProvider>
            <AuthProvider>
                <Router>
                    <Toaster />
                    <RoutesComponent />
                </Router>
            </AuthProvider>
        </QueryProvider>
    );
}

export default App;
