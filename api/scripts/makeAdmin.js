const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const makeAdmin = async (email) => {
  await connectDB();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }
    user.role = 'admin';
    await user.save();
    console.log(`User ${email} is now an admin`);
  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

makeAdmin('simroz.asrany6@gmail.com');
