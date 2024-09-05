require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const express = require('express');
const cron = require('node-cron');

// Import routes
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
    process.exit(1); // Exit process with failure
  }
}

// Connect to the database and start the server
connectToDatabase();

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Scheduled job to check pending tasks
cron.schedule('* * * * *', async () => {
  try {
    const collection = mongoose.connection.collection('tasks');
    
    const pendingTasks = await collection.find({
      status: 'pending',
      next_execute_date_time: { $lt: new Date() }
    }).toArray();

    for (const task of pendingTasks) {
      console.log(`Task "${task.name}" is now complete`);
      await collection.updateOne(
        { _id: task._id },
        { $set: { status: 'done' } }
      );
    }
  } catch (err) {
    console.error('Error running scheduled task:', err);
  }
});
