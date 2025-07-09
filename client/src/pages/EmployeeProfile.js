import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, Button, MenuItem, Select, FormControl, 
  InputLabel, Paper, IconButton, Avatar, Divider, Chip 
} from '@mui/material';
import { 
  ArrowBackIosNew as ArrowBackIcon, 
  ArrowForwardIos as ArrowForwardIcon,
  Event as CalendarIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Work as WorkIcon,
  LocalHospital as SickIcon,
  BeachAccess as PersonalIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { green, red, blue, orange, purple } from '@mui/material/colors';

const leaveCategories = [
  { value: 'personal', label: 'Personal Leave', limit: 10, icon: <PersonalIcon /> },
  { value: 'sick', label: 'Sick Leave', limit: 7, icon: <SickIcon /> },
  { value: 'casual', label: 'Casual Leave', limit: 7, icon: <WorkIcon /> }
];

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'present' ? green[100] : red[100],
  color: status === 'present' ? green[800] : red[800],
  fontWeight: 600,
  marginRight: theme.spacing(1)
}));

const CalendarDay = styled(Box)(({ theme, selected, status }) => ({
  width: 36,
  height: 36,
  margin: theme.spacing(0.5),
  backgroundColor: selected ? blue[200] : 
    (status === 'present' ? green[100] : 
    (status === 'absent' ? red[100] : theme.palette.background.paper)),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[2]
  },
  border: selected ? `2px solid ${blue[500]}` : '1px solid rgba(0,0,0,0.1)'
}));

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState('present');
  const [leaveType, setLeaveType] = useState('');
  const [leaveBalances, setLeaveBalances] = useState({ personal: 10, sick: 7, casual: 7 });
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'yearly'

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:2000/api/employees`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch employees');
        const employees = await response.json();
        const emp = employees.find(e => e._id === id);
        setEmployee(emp);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    const fetchAttendanceAndLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        const attendanceRes = await fetch(`http://localhost:2000/api/attendance/${id}?year=${displayYear}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const attendanceData = await attendanceRes.json();
        const attendanceMap = {};
        attendanceData.forEach(record => {
          attendanceMap[new Date(record.date).toDateString()] = record;
        });
        setAttendance(attendanceMap);

        const leaveRes = await fetch(`http://localhost:2000/api/leave-balance/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const leaveData = await leaveRes.json();
        setLeaveBalances(leaveData);
      } catch (error) {
        console.error('Error fetching attendance or leave balances:', error);
      }
    };

    fetchEmployee();
    fetchAttendanceAndLeaves();
  }, [id, displayYear]);

  useEffect(() => {
    const today = new Date();
    if (displayYear < today.getFullYear() || (displayYear === today.getFullYear() && displayMonth < today.getMonth())) {
      const timer = setTimeout(() => {
        if (displayMonth === 11) {
          setDisplayMonth(0);
          setDisplayYear(displayYear + 1);
        } else {
          setDisplayMonth(displayMonth + 1);
        }
      }, 1000 * 60 * 60 * 24);
      return () => clearTimeout(timer);
    }
  }, [displayYear, displayMonth]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const record = attendance[date.toDateString()];
    if (record) {
      setStatus(record.status);
      setLeaveType(record.leaveType || '');
    } else {
      setStatus('present');
      setLeaveType('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate) return;
    if (status === 'absent' && !leaveType) {
      alert('Please select a leave type for absence.');
      return;
    }
    if (status === 'absent' && leaveBalances[leaveType] <= 0) {
      alert(`No ${leaveType} leaves remaining.`);
      return;
    }
    try {
      const response = await fetch('http://localhost:2000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: id,
          date: selectedDate,
          status,
          leaveType: status === 'absent' ? leaveType : null
        })
      });
      if (!response.ok) throw new Error('Failed to save attendance');
      
      // Update local state
      setAttendance(prev => ({
        ...prev,
        [selectedDate.toDateString()]: { status, leaveType }
      }));
      
      // Refetch leave balances
      if (status === 'absent') {
        try {
          const leaveRes = await fetch(`http://localhost:2000/api/leave-balance/${id}`);
          if (leaveRes.ok) {
            const leaveData = await leaveRes.json();
            setLeaveBalances(leaveData);
          }
        } catch (error) {
          console.error('Error fetching leave balances:', error);
        }
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance');
    }
  };

  const handleYearChange = (event) => {
    setDisplayYear(parseInt(event.target.value, 10));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleMonthChange = (event) => {
    setDisplayMonth(parseInt(event.target.value, 10));
  };

  const renderCalendar = () => {
    const firstDay = new Date(displayYear, displayMonth, 1);
    const lastDay = new Date(displayYear, displayMonth + 1, 0);
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<Box key={`empty-${i}`} sx={{ width: 36, height: 36, m: 0.5 }} />);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(displayYear, displayMonth, day);
      const record = attendance[date.toDateString()];
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push(
        <CalendarDay
          key={day}
          onClick={() => handleDateClick(date)}
          selected={isSelected}
          status={record?.status}
        >
          {day}
        </CalendarDay>
      );
    }
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        maxWidth: 280,
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 2,
        p: 1,
        boxShadow: 1
      }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <Typography key={day} variant="caption" sx={{ 
            width: 36, 
            textAlign: 'center', 
            m: 0.5,
            fontWeight: 'bold',
            color: 'text.secondary'
          }}>
            {day}
          </Typography>
        ))}
        {days}
      </Box>
    );
  };

  const renderYearlyCalendar = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {months.map(month => {
          const firstDay = new Date(displayYear, month, 1);
          const lastDay = new Date(displayYear, month + 1, 0);
          const days = [];

          // Add empty cells for days before the first day of month
          for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(<Box key={`empty-${month}-${i}`} sx={{ width: 36, height: 36, m: 0.5 }} />);
          }

          for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(displayYear, month, day);
            const record = attendance[date.toDateString()];
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            days.push(
              <CalendarDay
                key={`${month}-${day}`}
                onClick={() => handleDateClick(date)}
                selected={isSelected}
                status={record?.status}
              >
                {day}
              </CalendarDay>
            );
          }

          return (
            <Box key={month} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
              <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1 }}>
                {new Date(0, month).toLocaleString('default', { month: 'long' })}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                maxWidth: 280,
                background: 'rgba(255,255,255,0.8)',
                borderRadius: 2,
                p: 1,
                boxShadow: 1
              }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <Typography key={day} variant="caption" sx={{ 
                    width: 36, 
                    textAlign: 'center', 
                    m: 0.5,
                    fontWeight: 'bold',
                    color: 'text.secondary'
                  }}>
                    {day}
                  </Typography>
                ))}
                {days}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  if (!employee) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Typography variant="h6">Loading employee data...</Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      p: 4,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh'
    }}>
      <Paper sx={{ 
        p: 4, 
        mb: 4,
        borderRadius: 3,
        boxShadow: 3,
        background: 'white'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          gap: 3
        }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              fontSize: '2rem',
              bgcolor: purple[500]
            }}
          >
            {employee.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {employee.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Employee ID: {employee.employeeId || 'N/A'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="body1">
                <strong>Email:</strong> {employee.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {employee.phone}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 4 
        }}>
          {/* Calendar Section */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                {displayYear}
              </Typography>
              <Box>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={displayYear}
                    label="Year"
                    onChange={handleYearChange}
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Button 
                variant={viewMode === 'monthly' ? 'contained' : 'outlined'} 
                onClick={() => handleViewModeChange('monthly')}
                sx={{ mr: 1 }}
              >
                Monthly View
              </Button>
              <Button 
                variant={viewMode === 'yearly' ? 'contained' : 'outlined'} 
                onClick={() => handleViewModeChange('yearly')}
              >
                Yearly View
              </Button>
            </Box>
            {viewMode === 'monthly' ? renderCalendar() : renderYearlyCalendar()}
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 3,
              gap: 1
            }}>
              <StatusChip 
                label="Present" 
                status="present" 
                icon={<PresentIcon fontSize="small" />}
              />
              <StatusChip 
                label="Absent" 
                status="absent" 
                icon={<AbsentIcon fontSize="small" />}
              />
            </Box>
          </Box>
          
          {/* Attendance Form Section */}
          {selectedDate && (
            <Paper sx={{ 
              p: 3, 
              flex: 1,
              maxWidth: 400,
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)',
              boxShadow: 2
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Attendance for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                </Select>
              </FormControl>
              
              {status === 'absent' && (
                <>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Leave Type</InputLabel>
                    <Select
                      value={leaveType}
                      label="Leave Type"
                      onChange={(e) => setLeaveType(e.target.value)}
                    >
                      {leaveCategories.map((leave) => (
                        <MenuItem
                          key={leave.value}
                          value={leave.value}
                          disabled={leaveBalances[leave.value] <= 0}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {leave.icon}
                            {leave.label} ({leaveBalances[leave.value]}/{leave.limit} remaining)
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
              
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSubmit}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
                }}
              >
                Save Attendance
              </Button>
            </Paper>
          )}
        </Box>
      </Paper>
      
      {/* Leave Balances Section */}
      <Paper sx={{ 
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        background: 'white'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Leave Balances
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap'
        }}>
          {leaveCategories.map((leave) => (
            <Paper 
              key={leave.value} 
              sx={{ 
                p: 2, 
                minWidth: 180,
                borderRadius: 2,
                background: leaveBalances[leave.value] <= 2 ? 
                  (leaveBalances[leave.value] === 0 ? red[50] : orange[50]) : green[50]
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {leave.icon}
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {leave.label}
                </Typography>
              </Box>
              <Typography variant="body2">
                Used: {leave.limit - leaveBalances[leave.value]} days
              </Typography>
              <Typography variant="body2">
                Remaining: {leaveBalances[leave.value]} days
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                bgcolor: 'rgba(0,0,0,0.1)', 
                borderRadius: 4,
                mt: 1,
                overflow: 'hidden'
              }}>
                <Box sx={{
                  width: `${(leaveBalances[leave.value] / leave.limit) * 100}%`, 
                  height: '100%',
                  bgcolor: leaveBalances[leave.value] <= 2 ? 
                    (leaveBalances[leave.value] === 0 ? red[500] : orange[500]) : green[500]
                }} />
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeProfile;
