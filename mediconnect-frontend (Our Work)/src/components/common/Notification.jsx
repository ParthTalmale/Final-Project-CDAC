import React from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const icon = type === 'success' ? '✓' : '✖';

    return (
        <div className={`notification ${type}`}>
            <span className="notification-icon">{icon}</span>
            <p>{message}</p>
            <button className="notification-close" onClick={onClose}>×</button>
        </div>
    );
};

export default Notification;
