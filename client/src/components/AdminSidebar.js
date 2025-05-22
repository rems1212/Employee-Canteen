import React, { useState, useEffect } from 'react';
import './AdminSidebar.css';
import logo from '../logo.svg';

const AdminSidebar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = currentTime.toLocaleDateString(undefined, options);
  const timeString = currentTime.toLocaleTimeString();

  return (
    <div className="admin-sidebar">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="company-logo" />
      </div>
      <h2 className="sidebar-title">AdminDashboard</h2>
      <div className="datetime-container">
        <div className="date">{dateString}</div>
        <div className="time">{timeString}</div>
      </div>
    </div>
  );
};

export default AdminSidebar;
