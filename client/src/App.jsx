import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  if (showLogin) {
    return <Login onSwitchToRegister={() => setShowLogin(false)} />;
  } else {
    return <Register onSwitchToLogin={() => setShowLogin(true)} />;
  }
}

export default App;
