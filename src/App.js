import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from "./security/AuthContext";
import Logout from "./components/Logout";
import PropertyForm from "./components/PropertyForm";
import ApplyProperty from "./components/ApplyProperty";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import UserProperties from "./components/UserProperties";
import FooterComponent from "./components/FooterComponent";

function AuthenticatedRoute({ children }) {
  const authContext = useAuth();
  return authContext.isAuthenticated ? children:<Navigate to="/login" />;
}


function App() {

  return (
    <div>
    <AuthProvider>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={
            <AuthenticatedRoute>
              <Logout />
            </AuthenticatedRoute>
          } />
          <Route path="/property" element={
            <AuthenticatedRoute>
              <PropertyForm />
            </AuthenticatedRoute>
          } />
          <Route path="/property/apply" element={
            <AuthenticatedRoute>
              <ApplyProperty />
            </AuthenticatedRoute>
          } />
          <Route path="/my-properties" element={
            <AuthenticatedRoute>
              <UserProperties />
            </AuthenticatedRoute>
          } />

        </Routes>
        <FooterComponent/>
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;
