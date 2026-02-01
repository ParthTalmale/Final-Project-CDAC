import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SettingsLayout from "./SettingsLayout";
import Notification from "./Notification";
import Appearance from "./Appearance";
import EditProfile from "./EditProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/settings/notification" />} />

        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="notification" />} />
          <Route path="notification" element={<Notification />} />
          <Route path="appearance" element={<Appearance />} />
          <Route path="edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
