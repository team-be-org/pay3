import { useEffect, React } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import User from './pages/User';
import Service from './pages/Service';

function App() {
  useEffect(() => {}, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/user" element={<User />} />
          <Route path="/service" element={<Service />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;