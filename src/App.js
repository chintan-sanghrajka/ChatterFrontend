import "./App.css";
import PrivateRoute from "./auth/PrivateRoute.jsx";
import PublicRoute from "./auth/PublicRoute.jsx";
import LoginPage from "./components/userComponents/LoginPage.jsx";
import SignupPage from "./components/userComponents/SignupPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatPage from "./components/chatComponents/ChatPage.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat-page" element={<ChatPage />} />
          </Route>

          <Route path="/" element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
