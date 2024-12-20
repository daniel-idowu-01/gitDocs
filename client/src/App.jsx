import { Routes, Route } from "react-router-dom";
import { Home, AdminDashboard, Login, SignUp, NotFound } from "./pages";
import ProtectedRoute from "./ui/components/ProtectedRoute";

function App() {
  return (
    <div className="montserrat-font">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

//  : color for button on disabled

export default App;
