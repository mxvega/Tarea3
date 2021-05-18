import React, { useState, useEffect } from 'react';
import socket from './socket-io-server';
import moment from 'moment';
import './Chats-socket.css';

const Chats = () => {

  const [clientName, setClientName] = useState("");
  const [livechat, setChat] = useState("");
  const [livechats, setChats] = useState([]);
  const [nickname, setNickname] = useState(false);
  
  useEffect(() => {
      socket.on('CHAT', livechat => {
          setChats((prev)=>[...prev, livechat]); 
      })
  }, []);

  const chatMessages = (event) => {
    event.preventDefault();
    socket.emit("CHAT", {name: clientName, message: livechat});
  };

  const logInChat = (event) => {
    event.preventDefault();
    if (clientName !== "") {
      setNickname(true);
    } 
  };

  return (
    <div className="container">
      {
        !nickname &&
        <form onSubmit={logInChat}>
          <p>Type a nickname:</p>
          <input align="center" type="text" value={clientName} onChange={e => setClientName(e.target.value)}></input>
          <input type="submit" value="send"></input>
        </form>
      }
      {
        nickname &&
        <form onSubmit={chatMessages}>
          <p>Type a message:</p>
          <input align="center" type="text" value={livechat} onChange={e => setChat(e.target.value)}></input>
          <input type="submit" value="send"></input>
        </form>
      }
      <div className="container" style={{textAlign: "left"}}>
        {livechats.map(function(mensajes) {
          if (mensajes) { return (
            <div className="order-message">
              <p>{mensajes.name}, {moment(new Date(mensajes.date)).format('LLL')}: {mensajes.message}</p>  
            </div>
          )}
        })}
      </div>

    </div>
  )
};

export default Chats;