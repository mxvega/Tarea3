import { Icon } from 'leaflet';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import socket from './socket-io-server'
import avioncito from './chat-app/avioncito.png'

const Flights = () => {

  const [flight, setFlight] = useState([]);
  const [position, setPosition] = useState([]);

  const limeOptions = { color: 'lime' }

  const imgAvion = new Icon({
    iconUrl: avioncito,
    iconSize: [38,38]
  });
  
  useEffect(() => {
    socket.emit('FLIGHTS'); 
    socket.on('FLIGHTS', message => {
      setFlight(message);
    });
  }, []);
  
   useEffect(() => {
    socket.on('POSITION', message => {
      setPosition((prev) => ([...prev, message]));
    })
  }, []);
  return (
    <div>
      <h2>Live Map</h2>
      <p>Click on a plane to see its code</p>
      <div id="leaflet-container">
        <MapContainer center={[-36, -65]} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flight.map(function(vuelos) {
            const multiPolyline = [
              [
                vuelos.origin[0], vuelos.origin[1]

              ],
              [
                vuelos.destination[0], vuelos.destination[1]
              ],
            ]
            return (
              <Polyline pathOptions={limeOptions} positions={multiPolyline} />
            )
          })}
          {flight.map(function(vuelos) {
            const origen = [
              vuelos.origin[0], vuelos.origin[1]
            ]
            return (
              <Marker position={origen}>
              </Marker>  
            )
          })}
          {position.map(function(posicion) {
            const avionViajando = [
              posicion.position[0], posicion.position[1]
            ]
            return (
              <Marker position={avionViajando} icon={imgAvion}>
                <Popup code={posicion.code}>
                  <code>{posicion.code}</code>
                </Popup>
              </Marker>  
            )
          })}
        </MapContainer>
      </div>
      <h2>Flight Information</h2>
      <div className="order-container-title" style={{textAlign: "left"}}>
          {flight.map(function(vuelos) {
            return (
              <div className="order-container">
                <h3>Code: {vuelos.code}</h3>
                <p>Airline: {vuelos.airline}</p>
                <p>Origin: {vuelos.origin[0]}, {vuelos.origin[1]}</p>
                <p>Destination: {vuelos.destination[0]}, {vuelos.destination[1]}</p>
                <p>Plane: {vuelos.plane}</p>
                <p>Seats: {vuelos.seats}</p>
                <p>Passengers: </p>             
                <div className="order-container-passengers">
                  {vuelos.passengers.map(function(pasajeros) {
                    return (
                      <p>{pasajeros.name}, {pasajeros.age} years old</p>
                    )
                  })}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
};

export default Flights;