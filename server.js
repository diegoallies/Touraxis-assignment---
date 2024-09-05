const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

// Import routes
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

// Import Task model for the scheduled job
const Task = require('./models/Task');

// Initialize express app
const app = express();

// Set the port
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/touraxis', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes for managing users and tasks
app.use('/api/users', userRoutes);
app.use('/api/users', taskRoutes);

// Scheduled job to check pending tasks
cron.schedule('* * * * *', async () => {
  try {
    const pendingTasks = await Task.find({
      status: 'pending',
      next_execute_date_time: { $lt: new Date() }
    });

    pendingTasks.forEach(async (task) => {
      console.log(`Task "${task.name}" is now complete`);
      task.status = 'done';
      await task.save();
    });
  } catch (err) {
    console.error('Error running scheduled task:', err);
  }
});
