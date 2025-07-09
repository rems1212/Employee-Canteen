import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ToggleButton, 
  ToggleButtonGroup, 
  Button,
  Paper,
  Chip,
  Avatar,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Stack,
  Badge
} from '@mui/material';
import { 
  Person, 
  CheckCircle, 
  Cancel, 
  Sick, 
  Event, 
  FilterAlt,
  ArrowBack,
  ArrowForward,
  Search
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { format, addDays, subDays, parseISO } from 'date-fns';

const StatusBadge = styled(Badge)(({ theme, status }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: status === 'present' ? theme.palette.success.main : theme.palette.error.main,
    color: 'white',
    right: 10,
    top: 10,
    width: 24,
    height: 24,
    borderRadius: '50%'
  }
}));

const AttendanceCard = styled(Paper)(({ theme, status }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '12px',
  borderLeft: `4px solid ${status === 'present' ? theme.palette.success.main : theme.palette.error.main}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const leaveTypes = [
  { value: 'personal', label: 'Personal', icon: <Person color="info" /> },
  { value: 'sick', label: 'Sick', icon: <Sick color="warning" /> },
  { value: 'casual', label: 'Casual', icon: <Event color="action" /> }
];

const AttendanceList = () => {
  const [attendanceStatus, setAttendanceStatus] = useState('present');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const url = `http://localhost:2000/api/attendance?date=${date}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch attendance data');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    fetchAttendance();
  }, [date]);

  useEffect(() => {
    let filtered = employees.filter(emp => emp.attendance === attendanceStatus);
    
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLeaveType && attendanceStatus === 'absent') {
      filtered = filtered.filter(emp => 
        emp.leaveType === selectedLeaveType
      );
    }
    
    setFilteredEmployees(filtered);
  }, [attendanceStatus, employees, searchTerm, selectedLeaveType]);

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setAttendanceStatus(newStatus);
      setSelectedLeaveType('');
    }
  };

  const handleDateChange = (days) => {
    const newDate = days > 0 
      ? addDays(parseISO(date), days) 
      : subDays(parseISO(date), Math.abs(days));
    setDate(newDate.toISOString().split('T')[0]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedLeaveType('');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Employee Attendance
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => handleDateChange(-1)}>
            <ArrowBack />
          </IconButton>
          
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{
              minWidth: 150,
              borderRadius: '12px',
              '& .MuiInputBase-input': {
                padding: '10.5px 14px',
              },
            }}
            inputProps={{
              max: new Date().toISOString().split('T')[0],
            }}
          />
          
          <IconButton onClick={() => handleDateChange(1)}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <ToggleButtonGroup
          value={attendanceStatus}
          exclusive
          onChange={handleStatusChange}
          aria-label="attendance status"
          sx={{ 
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '12px !important',
              px: 3,
              '&.Mui-selected': {
                color: 'white',
                backgroundColor: attendanceStatus === 'present' ? 'success.main' : 'error.main'
              }
            }
          }}
        >
          <ToggleButton value="present" aria-label="present">
            <CheckCircle sx={{ mr: 1 }} />
            Present
          </ToggleButton>
          <ToggleButton value="absent" aria-label="absent">
            <Cancel sx={{ mr: 1 }} />
            Absent
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search employees..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px' }
            }}
          />
          
          {attendanceStatus === 'absent' && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={selectedLeaveType}
                onChange={(e) => setSelectedLeaveType(e.target.value)}
                label="Leave Type"
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="">All Types</MenuItem>
                {leaveTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={handleClearFilters}
            sx={{ borderRadius: '12px' }}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Showing {filteredEmployees.length} {attendanceStatus} employees
        </Typography>
      </Box>

      {filteredEmployees.length === 0 ? (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: '12px'
        }}>
          <Typography variant="h6" color="textSecondary">
            No {attendanceStatus} employees found
          </Typography>
          <Typography sx={{ mt: 1 }}>
            {searchTerm ? 'Try a different search term' : 'Try selecting a different date or status'}
          </Typography>
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          {filteredEmployees.map(emp => (
            <AttendanceCard 
              key={emp._id} 
              status={emp.attendance}
              elevation={2}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StatusBadge
                  overlap="circular"
                  status={emp.attendance}
                  badgeContent={emp.attendance === 'present' ? '✓' : '✗'}
                >
                  <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                    {emp.name.charAt(0)}
                  </Avatar>
                </StatusBadge>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {emp.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip 
                      label={emp.category} 
                      size="small" 
                      variant="outlined"
                    />
                    {emp.attendance === 'absent' && emp.leaveType && (
                      <Chip
                        label={leaveTypes.find(t => t.value === emp.leaveType)?.label || emp.leaveType}
                        size="small"
                        color="warning"
                        icon={leaveTypes.find(t => t.value === emp.leaveType)?.icon}
                      />
                    )}
                  </Stack>
                </Box>
                
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="textSecondary">
                    Last updated
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(), 'h:mm a')}
                  </Typography>
                </Box>
              </Box>
            </AttendanceCard>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AttendanceList;
