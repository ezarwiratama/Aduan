import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // Impor tema yang telah dibuat
import MessageDetail from "./components/MessageDetail";
import TambahKontak from "./components/TambahKontak";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PendingMessages from "./components/messageByStatus/PendingMessage";
import ProcessingMessages from "./components/messageByStatus/ProcessingMessage";
import DoneMessages from "./components/messageByStatus/DoneMessage";
import User from "./components/User";
import Settings from "./components/Settings";
import { UserProvider } from "./components/small-components/UserContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-contact" element={<TambahKontak />} />
            <Route path="/" element={<Login />} />
            <Route path="/message-detail/:id" element={<MessageDetail />} />
            <Route path="/pending-messages" element={<PendingMessages />} />
            <Route
              path="/processing-messages"
              element={<ProcessingMessages />}
            />
            <Route path="/done-messages" element={<DoneMessages />} />
            <Route path="/user" element={<User />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
