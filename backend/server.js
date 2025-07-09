require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace('localhost', '127.0.0.1') : 'mongodb://127.0.0.1:27017/yourdbname';

mongoose.connect(mongoUri)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
  canteen: { type: String, enum: ['canteen 1', 'canteen 2', 'canteen 3', 'canteen 4', 'canteen 5'], required: true }
});

const User = mongoose.model('User', UserSchema);

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  category: { type: String, enum: ['supervisor', 'Manager', 'Cook', 'Assistant Cook', 'Kitchen-Helpers', 'Sweepers', 'Utility'] },
  salary: Number,
  joiningDate: { type: Date, default: Date.now },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Added managerId to associate employee with manager
  canteen: { type: String, enum: ['canteen 1', 'canteen 2', 'canteen 3', 'canteen 4', 'canteen 5'], required: true }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// Customer Schema
const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', CustomerSchema);

// Sales Schema
const SaleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [{
    itemName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  saleDate: { type: Date, default: Date.now },
  canteen: { type: String, enum: ['canteen 1', 'canteen 2', 'canteen 3', 'canteen 4', 'canteen 5'], required: true }
});

const Sale = mongoose.model('Sale', SaleSchema);

// Inventory Schema
const InventorySchema = new mongoose.Schema({
  itemName: String,
  quantity: Number,
  price: Number,
  addedAt: { type: Date, default: Date.now },
  canteen: { type: String, enum: ['canteen 1', 'canteen 2', 'canteen 3', 'canteen 4', 'canteen 5'], required: true }
});

const Inventory = mongoose.model('Inventory', InventorySchema);

// Revenue can be calculated from sales totalAmount

// Customer API endpoints
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales API endpoints
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await Sale.find().populate('customerId');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inventory API endpoints
app.get('/api/inventory', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const inventory = await Inventory.find({ canteen: decoded.canteen });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UsageRecord Schema to track used quantities
const UsageRecordSchema = new mongoose.Schema({
  inventoryItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  quantityUsed: { type: Number, required: true },
  dateUsed: { type: Date, default: Date.now }
});

const UsageRecord = mongoose.model('UsageRecord', UsageRecordSchema);

// Updated endpoint to get used inventory items with usage records
app.get('/api/inventory/used', async (req, res) => {
  try {
    // Aggregate usage records with inventory item details
    const usedItems = await UsageRecord.aggregate([
      {
        $lookup: {
          from: 'inventories',
          localField: 'inventoryItemId',
          foreignField: '_id',
          as: 'inventoryItem'
        }
      },
      { $unwind: '$inventoryItem' },
      {
        $project: {
          _id: 1,
          inventoryItemId: 1,
          quantityUsed: 1,
          dateUsed: 1,
          itemName: '$inventoryItem.itemName',
          price: '$inventoryItem.price'
        }
      },
      { $sort: { dateUsed: -1 } }
    ]);
    res.json(usedItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const item = new Inventory({ ...req.body, canteen: decoded.canteen });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory quantity (reduce stock) and create usage record
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { quantityUsed } = req.body;
    if (typeof quantityUsed !== 'number' || quantityUsed <= 0) {
      return res.status(400).json({ error: 'Invalid quantityUsed value' });
    }
    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    if (inventoryItem.quantity < quantityUsed) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    inventoryItem.quantity -= quantityUsed;
    await inventoryItem.save();

    // Create usage record
    const usageRecord = new UsageRecord({
      inventoryItemId: inventoryItem._id,
      quantityUsed,
      dateUsed: new Date()
    });
    await usageRecord.save();

    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Revenue API endpoint (sum of sales totalAmount)
app.get('/api/revenue', async (req, res) => {
  try {
    const result = await Sale.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = result[0] ? result[0].totalRevenue : 0;
    res.json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Attendance Schema
const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  leaveType: { type: String, enum: ['personal', 'sick', 'casual', null], default: null }
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

// Supplier Schema
const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const Supplier = mongoose.model('Supplier', SupplierSchema);

// Supplier API endpoints

// Get all suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new supplier
app.post('/api/suppliers', async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role, canteen } = req.body;
    if (!canteen || !['canteen 1', 'canteen 2', 'canteen 3', 'canteen 4', 'canteen 5'].includes(canteen)) {
      return res.status(400).json({ message: 'Invalid or missing canteen' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'user', canteen });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    if (error.code === 11000) {
      // Duplicate key error (email already exists)
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Attendance API endpoints

app.get('/api/attendance/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const year = req.query.year ? parseInt(req.query.year, 10) : null;

    let query = { employeeId };

    if (year) {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31, 23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const attendanceRecords = await Attendance.find(query);
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit attendance record
app.post('/api/attendance', async (req, res) => {
  console.log('POST /api/attendance called with body:', req.body);
  try {
    const { employeeId, date, status, leaveType } = req.body;
    // Check if attendance for the date already exists
    let attendance = await Attendance.findOne({ employeeId, date: new Date(date) });
    if (attendance) {
      // Update existing record
      attendance.status = status;
      attendance.leaveType = leaveType || null;
    } else {
      // Create new record
      attendance = new Attendance({ employeeId, date: new Date(date), status, leaveType: leaveType || null });
    }
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route to verify backend connectivity
app.get('/api/test-attendance', (req, res) => {
  res.json({ message: 'Attendance API is reachable' });
});

// Get leave balances for an employee
app.get('/api/leave-balance/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    // Validate employeeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: 'Invalid employeeId' });
    }
    // Check if employee exists
    const employeeExists = await Employee.exists({ _id: employeeId });
    if (!employeeExists) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    // Calculate leaves taken by type, replacing null leaveType with 'none'
    const leaves = await Attendance.aggregate([
      { $match: { employeeId: new mongoose.Types.ObjectId(employeeId), status: 'absent' } },
      { $project: { leaveType: { $ifNull: ['$leaveType', 'none'] } } },
      { $group: { _id: '$leaveType', count: { $sum: 1 } } }
    ]);
    // Define leave limits
    const leaveLimits = { personal: 10, sick: 7, casual: 7 };
    // Calculate remaining leaves
    const leaveBalances = {};
    for (const [type, limit] of Object.entries(leaveLimits)) {
      const taken = leaves.find(l => l._id === type)?.count || 0;
      leaveBalances[type] = limit - taken;
    }
    res.json(leaveBalances);
  } catch (error) {
    console.error('Error in leave-balance route:', error);
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password, canteen } = req.body;
    const user = await User.findOne({ email, canteen });
    if (!user) return res.status(400).json({ message: 'User not found or canteen mismatch' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role, canteen: user.canteen }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, canteen: user.canteen } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employee CRUD operations
app.post('/api/employees', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const managerId = decoded.id;

    const employeeData = { ...req.body, canteen: decoded.canteen };
    if (decoded.role === 'manager') {
      employeeData.managerId = managerId; // Associate employee with manager
    }

    const employee = new Employee(employeeData);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let employees;
    if (decoded.role === 'manager') {
      employees = await Employee.find({ managerId: decoded.id, canteen: decoded.canteen });
    } else {
      employees = await Employee.find({ canteen: decoded.canteen });
    }
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/employees/:category', async (req, res) => {
  try {
    const employees = await Employee.find({ category: req.params.category });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee by ID
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete employee by ID
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Token verification route
app.get('/api/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, userId: decoded.id, role: decoded.role });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get attendance status for all employees for a given date (default today)
app.get('/api/attendance', async (req, res) => {
  try {
    const dateQuery = req.query.date ? new Date(req.query.date) : new Date();
    // Normalize date to midnight for matching without mutating dateQuery
    const start = new Date(dateQuery);
    start.setHours(0,0,0,0);
    const end = new Date(dateQuery);
    end.setHours(23,59,59,999);
    // Get all employees
    const employees = await Employee.find();
    // Get attendance records for the date
    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end }
    });
    // Map attendance by employeeId
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      attendanceMap[record.employeeId.toString()] = record;
    });
    // Combine employee data with attendance status
    const result = employees.map(emp => {
      const attendance = attendanceMap[emp._id.toString()];
      return {
        _id: emp._id,
        name: emp.name,
        category: emp.category,
        attendance: attendance ? attendance.status : 'absent',
        leaveType: attendance ? (attendance.leaveType || 'none') : 'none'
      };
    });
    console.log('Attendance API response:', result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
