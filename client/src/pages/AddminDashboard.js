import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AddminDashboard.css';
import AdminSidebar from '../components/AdminSidebar';

const AddminDashboard = () => {
  const navigate = useNavigate();

  const handleBoxClick = (canteen) => {
    navigate(`/admin/employees/${canteen}`);
  };

  return (
    <div className="admindashboard-wrapper">
      <AdminSidebar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin (Owner) Dashboard</h1>
        <div className="title-line"></div>
        <div className="boxes-container">
          <div
            className="box canteen-one"
            onClick={() => handleBoxClick('canteen-one')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handleBoxClick('canteen-one'); }}
          >
            Canteen One
          </div>
          <div
            className="box canteen-two"
            onClick={() => handleBoxClick('canteen-two')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handleBoxClick('canteen-two'); }}
          >
            Canteen Two
          </div>
          <div
            className="box canteen-three"
            onClick={() => handleBoxClick('canteen-three')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handleBoxClick('canteen-three'); }}
          >
            Canteen Three
          </div>
          <div
            className="box box-four"
            onClick={() => handleBoxClick('canteen-four')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handleBoxClick('canteen-four'); }}
          >
            Canteen Four
          </div>
          <div
            className="box box-five"
            onClick={() => handleBoxClick('canteen-five')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handleBoxClick('canteen-five'); }}
          >
            Canteen Five
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddminDashboard;
