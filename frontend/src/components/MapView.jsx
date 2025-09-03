import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import styles from './MapView.module.scss';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

// Leaflet 기본 아이콘 설정
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
    const position = [36.5, 127.5];
    const [units, setUnits] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9001/api/units', {
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })


        // WebSocket 연결 설정
        const client = new Client({
            brokerURL: 'ws://localhost:9001/ws',
            connectHeaders: {},
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        client.onConnect = function () {
            console.log('Connected to WebSocket');

            client.subscribe('/topic/units', function (message) {
                try {
                    const updatedUnit = JSON.parse(message.body);
                    setUnits(prevUnits => {
                        const unitIndex = prevUnits.findIndex(u => u.id === updatedUnit.id);
                        if (unitIndex === -1) {
                            return [...prevUnits, updatedUnit];
                        } else {
                            const newUnits = [...prevUnits];
                            newUnits[unitIndex] = updatedUnit;
                            return newUnits;
                        }
                    });
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            });
        };

        client.onStompError = function (frame) {
            console.error('STOMP error:', frame);
        };

        client.activate();

        // cleanup function
        return () => {
            if (client.active) {
                client.deactivate();
                console.log('WebSocket connection closed');
            }
        };
    }, []);

    return (
        <MapContainer className={styles['map-container']} center={position} zoom={7} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {units.map(unit => (
                <Marker key={unit.id} position={[unit.latitude, unit.longitude]}>
                    <Popup>
                        <b>{unit.name}</b><br />
                        진영: {unit.faction}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;