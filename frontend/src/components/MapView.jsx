import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapView.module.scss';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// --- 1. 커스텀 아이콘 설정 ---
import ReactDOMServer from 'react-dom/server';
import { FaUserShield, FaUserSecret, FaCrosshairs } from 'react-icons/fa';

const friendIcon = L.divIcon({
    html: ReactDOMServer.renderToString(<FaUserShield style={{ color: '#007bff', fontSize: '24px' }} />),
    className: '', // 기본 클래스 제거
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

const enemyIcon = L.divIcon({
    html: ReactDOMServer.renderToString(<FaUserSecret style={{ color: '#dc3545', fontSize: '24px' }} />),
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

const hqIcon = L.divIcon({
    html: ReactDOMServer.renderToString(<FaCrosshairs style={{ color: '#28a745', fontSize: '24px' }} />),
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});


const MapView = () => {
    const position = [36.5, 127.5];
    const [units, setUnits] = useState([]);

    useEffect(() => {
        axios.get('/api/units')
            .then(response => {
                setUnits(response.data);
            })
            .catch(error => {
                console.error("Error fetching units:", error);
            });

        const socket = new SockJS('/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/units', (message) => {
                const updatedUnit = JSON.parse(message.body);
                setUnits(prevUnits =>
                    prevUnits.map(unit =>
                        unit.id === updatedUnit.id ? updatedUnit : unit
                    )
                );
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    // 2. faction에 따라 다른 아이콘을 반환하는 함수
    const getIcon = (faction) => {
        switch (faction) {
            case 'FRIEND':
                return friendIcon;
            case 'ENEMY':
                return enemyIcon;
            case 'HQ':
                return hqIcon;
            default:
                return friendIcon;
        }
    };

    return (
        <MapContainer className={styles['map-container']} center={position} zoom={7} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {units.map(unit => (
                // 3. faction에 맞는 아이콘을 Marker에 적용
                <Marker key={unit.id} position={[unit.latitude, unit.longitude]} icon={getIcon(unit.faction)}>
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