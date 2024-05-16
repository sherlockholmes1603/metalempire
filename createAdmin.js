const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// Function to create an admin user
const createAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ username: process.env.ADMIN_USERNAME });
        if (existingAdmin) {
            console.log('Admin user already exists');
            mongoose.connection.close();
            return;
        }

        const admin = new User({ username: process.env.ADMIN_USERNAME });
        await User.register(admin, process.env.ADMIN_PASSWORD);
        admin.isAdmin = true;
        await admin.save();

        console.log('Admin user created successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating admin user:', error);
        mongoose.connection.close();
    }
};

createAdmin();