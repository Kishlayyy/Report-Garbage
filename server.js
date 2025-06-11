const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://Kishlay:Kishlay@cluster0.ou9vgfq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// MongoDB Schema
const reportSchema = new mongoose.Schema({
  name: String,
  description: String,
  wasteType: String, // 👈 Add this line
  lat: Number,
  lng: Number,
  image: String,
  timestamp: { type: Date, default: Date.now }
});


const Report = mongoose.model('Report', reportSchema);

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Serve form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/report', upload.single('image'), async (req, res) => {
  const { name, description, wasteType, lat, lng } = req.body;  
  const image = req.file ? req.file.filename : null;


  const report = new Report({ name, description, wasteType, lat, lng, image });
  await report.save();

  res.send(`<h2>Thanks, ${name}! Your report has been saved.</h2>`);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
app.use(express.static(__dirname));


