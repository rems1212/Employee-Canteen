const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace('localhost', '127.0.0.1') : 'mongodb://127.0.0.1:27017/yourdbname';

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  category: { type: String, enum: ['cook', 'waiter', 'sweeper'] },
  salary: Number,
  joiningDate: { type: Date, default: Date.now }
});
const Employee = mongoose.model('Employee', EmployeeSchema);

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  leaveType: { type: String, enum: ['personal', 'sick', 'casual', null], default: null }
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find an employee to assign attendance
    const employee = await Employee.findOne();
    if (!employee) {
      console.log('No employee found. Please add employees first.');
      process.exit(1);
    }

    // Create sample attendance records for May 1-5, 2025
    const attendanceData = [];
    for (let day = 1; day <= 5; day++) {
      attendanceData.push({
        employeeId: employee._id,
        date: new Date(2025, 4, day), // Month is 0-based, so 4 = May
        status: day % 2 === 0 ? 'absent' : 'present',
        leaveType: day % 2 === 0 ? 'personal' : null
      });
    }

    // Insert attendance records
    await Attendance.insertMany(attendanceData);
    console.log('Sample attendance records inserted.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding attendance:', error);
    process.exit(1);
  }
}

seed();
