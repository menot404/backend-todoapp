const mongoose = require('mongoose');

const todoConnection = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
        return process.exit(1);
    }
}

module.exports = todoConnection;