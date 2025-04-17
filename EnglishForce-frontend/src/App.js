import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import UserLayout from "./Layouts/UserLayout"
import { UserRoutes } from './Routes/userRoutes.js';
import { AdminRoutes } from './Routes/adminRoutes.js';

function App() {
  return (
    <Router>
      <Routes>
        {UserRoutes()}
        {AdminRoutes()}

        {/* 404 */}
        <Route path="*" element={<UserLayout>
          <img src="/404.jpeg" alt="404 Not Found" style={{ maxWidth: "100%", height: "auto" }} />
        </UserLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
