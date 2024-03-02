import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WebsocketWrapper from './context/WebsocketWrapper'
import Admin from './pages/admin'
import Tracker from './pages/Tracker'
import Driver from './pages/Driver'
import Index from './pages'


function App() {

  return (
    <Router>
      <WebsocketWrapper>
        <Routes>
          <Route path={'/web-tracker'} element={<Tracker />} />
          <Route path={'/web-driver'} element={<Driver />} />
          <Route path={'/web-admin/*'} element={<Admin />} />
          <Route path={'*'} element={<Index />} />
        </Routes>
      </WebsocketWrapper>
    </Router>
  );
}

export default App;
