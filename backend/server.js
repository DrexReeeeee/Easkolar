const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const chatBotRouter = require('./routes/chatBotRoutes');
const adminScholarshipRoutes = require('./routes/adminScholarships');

app.use('/api/admin/scholarships', adminScholarshipRoutes);


app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/chatbot', chatBotRouter);

// Test route
app.get('/', (req, res) => {
  res.send('EaseKolar backend is running!');
});


sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connection successful!');
    return sequelize.sync(); 
  })
  .then(() => {
    console.log('📦 Models synced!');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB Error:', err);
  });
