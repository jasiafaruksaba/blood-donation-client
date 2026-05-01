
import { Outlet } from "react-router";
import AuthProvider from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export default App;