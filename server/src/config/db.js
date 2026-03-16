const mongoose = require('mongoose');

const connectDB = async () => {
  try {
<<<<<<< HEAD
    const conn = await mongoose.connect(process.env.MONGODB_URI);
=======
    const conn = await mongoose.connect(process.env.MONGO_URI);
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed');
    process.exit(1);
  }
};

<<<<<<< HEAD
module.exports = connectDB;
=======
module.exports = connectDB;
>>>>>>> e25889bd8e943885bb958141fbb1daf8bfc16429
