import React from "react";
import './App.css';
import Flights from "./Flights";
import Chats from "./Chats-socket";


const App = () => {
  return (
    <div>
      <h1>Flight Control Center</h1>
      <Flights />
      <h2>Chat</h2>
      <Chats />

    </div>
  );
};

export default App;