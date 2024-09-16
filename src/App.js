import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes  ,Navigate} from 'react-router-dom';
import LobbyScreen from "./screens/Lobby";
import RoomPage from "./screens/Room";
import { Toaster } from "react-hot-toast";
import Home  from "./pages/Home"


function App() {
  return (
    <div className=''>
      <Routes>				
        <Route path="/" element={<Home/>}/>
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;