import React from 'react';
import MapView from './components/MapView';
import styles from './App.module.scss'; // CSS 모듈 방식으로 import

function App() {
    return (
        <div className={styles.App}>
            <header className={styles.AppHeader}>
                <h1>🦅 Eagle Eye: 전술 상황판</h1>
            </header>
            <main className={styles.AppMain}>
                <MapView />
            </main>
        </div>
    );
}

export default App;