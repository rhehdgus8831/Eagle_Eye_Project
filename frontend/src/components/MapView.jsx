import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import styles from './MapView.module.scss';
import axios from 'axios';

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
        axios.get('http://localhost:9001/api/units')
            .then(response => {
                setUnits(response.data);
            })
            .catch(error => {
                console.error("Error fetching units:", error);
            });
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