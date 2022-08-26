import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';

function App() {
  const [logedIn, setLogedIn] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<Homepage logedIn={logedIn} />} />
        </Routes>

      </div>
    </BrowserRouter>


  );
}

export default App;