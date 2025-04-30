require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect('mongodb+srv://shimalvip:8XeqDaaadWe6Bj4Y@wt.bxj3qzm.mongodb.net/restaurent', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    menu: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        description: { type: String }
    }],
    rating: { type: Number, default: 0 },
    cuisine: { type: String },
    deliveryTime: { type: String }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// This is a snippet that shows the necessary changes to the Order schema

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        dish: { 
            type: mongoose.Schema.Types.Mixed, // Changed from ObjectId to Mixed type
            required: true 
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Seed Data
const seedData = async () => {
    try {
        await Restaurant.deleteMany();
        await User.deleteMany();

        const restaurants = [
            {
                name: "Italian Delight",
                image: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590",
                cuisine: "Italian",
                deliveryTime: "30-40 mins",
                rating: 4.5,
                menu: [
                    {
                        name: "Pasta Alfredo",
                        price: 12.99,
                        image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb",
                        description: "Creamy Alfredo sauce with fettuccine pasta"
                    },
                    {
                        name: "Margherita Pizza",
                        price: 14.99,
                        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
                        description: "Classic pizza with tomato sauce and mozzarella"
                    }
                ]
            },
            {
                name: "Asian Fusion",
                image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
                cuisine: "Asian",
                deliveryTime: "25-35 mins",
                rating: 4.2,
                menu: [
                    {
                        name: "Pad Thai",
                        price: 11.99,
                        image: "https://images.unsplash.com/photo-1516684732162-798a0062be99",
                        description: "Stir-fried rice noodle dish with eggs and tofu"
                    },
                    {
                        name: "Sushi Platter",
                        price: 18.99,
                        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
                        description: "Assorted fresh sushi with wasabi and soy sauce"
                    }
                ]
            },
            {
                name: "Taco Fiesta",
                image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
                cuisine: "Mexican",
                deliveryTime: "20-30 mins",
                rating: 4.7,
                menu: [
                    {
                        name: "Chicken Tacos",
                        price: 9.99,
                        image: "https://images.unsplash.com/photo-1599974579688-8db88c07b20b",
                        description: "Soft corn tortillas with grilled chicken and salsa"
                    },
                    {
                        name: "Burrito Supreme",
                        price: 11.49,
                        image: "https://images.unsplash.com/photo-1562059390-a761a084802c",
                        description: "Flour tortilla stuffed with beef, beans, and cheese"
                    },
                    {
                        name: "Churros",
                        price: 5.99,
                        image: "https://images.unsplash.com/photo-1626016736488-4d37856906a5",
                        description: "Crispy fried dough dusted with cinnamon sugar"
                    }
                ]
            },
            {
                name: "Spice of India",
                image: "https://images.unsplash.com/photo-1567189717699-7b0bd33c6c2c",
                cuisine: "Indian",
                deliveryTime: "35-45 mins",
                rating: 4.4,
                menu: [
                    {
                        name: "Butter Chicken",
                        price: 13.99,
                        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
                        description: "Tender chicken in a creamy tomato sauce"
                    },
                    {
                        name: "Vegetable Biryani",
                        price: 10.99,
                        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
                        description: "Fragrant basmati rice with mixed vegetables"
                    },
                    {
                        name: "Naan Bread",
                        price: 2.99,
                        image: "https://images.unsplash.com/photo-1589211737733-07d8f08f6262",
                        description: "Soft, fluffy Indian flatbread"
                    }
                ]
            },
            {
                name: "Burger Bonanza",
                image: "https://images.unsplash.com/photo-1553979459-d2229c1e6d6f",
                cuisine: "American",
                deliveryTime: "15-25 mins",
                rating: 4.3,
                menu: [
                    {
                        name: "Classic Cheeseburger",
                        price: 8.99,
                        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
                        description: "Beef patty with cheddar, lettuce, and tomato"
                    },
                    {
                        name: "Sweet Potato Fries",
                        price: 4.99,
                        image: "https://images.unsplash.com/photo-1639744091988-9c8b7f7e581a",
                        description: "Crispy fries with a sweet twist"
                    },
                    {
                        name: "Milkshake",
                        price: 5.49,
                        image: "https://images.unsplash.com/photo-1572490122747-3968b75f6835",
                        description: "Creamy vanilla milkshake topped with whipped cream"
                    }
                ]
            },
            {
                name: "Mediterranean Breeze",
                image: "https://images.unsplash.com/photo-1517315003714-a071486bd9ea",
                cuisine: "Mediterranean",
                deliveryTime: "25-35 mins",
                rating: 4.6,
                menu: [
                    {
                        name: "Falafel Wrap",
                        price: 9.49,
                        image: "https://images.unsplash.com/photo-1590743436280-5b58649639f1",
                        description: "Crispy falafel with tahini and veggies in a pita"
                    },
                    {
                        name: "Greek Salad",
                        price: 7.99,
                        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
                        description: "Fresh greens with feta, olives, and cucumber"
                    },
                    {
                        name: "Baklava",
                        price: 4.99,
                        image: "https://images.unsplash.com/photo-1621330396173-e9b3b3c596d5",
                        description: "Sweet pastry with nuts and honey syrup"
                    }
                ]
            },
            {
                name: "BBQ Haven",
                image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd",
                cuisine: "Barbecue",
                deliveryTime: "40-50 mins",
                rating: 4.8,
                menu: [
                    {
                        name: "Pulled Pork Sandwich",
                        price: 10.99,
                        image: "https://images.unsplash.com/photo-1603138468768-1e6626182f37",
                        description: "Slow-cooked pork with tangy BBQ sauce"
                    },
                    {
                        name: "Baby Back Ribs",
                        price: 16.99,
                        image: "https://images.unsplash.com/photo-1593249581054-9954e5f2c8e3",
                        description: "Tender ribs slathered in smoky sauce"
                    },
                    {
                        name: "Coleslaw",
                        price: 3.99,
                        image: "https://images.unsplash.com/photo-1595772090581-a2e273e71b23",
                        description: "Creamy cabbage salad with a zesty dressing"
                    }
                ]
            }
        ];

        await Restaurant.insertMany(restaurants);

        // Create a test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword
        });

        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Create token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Restaurant Routes
app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Order Routes
app.post('/api/orders', authenticate, async (req, res) => {
    try {
        const { items, total, deliveryAddress, paymentMethod } = req.body;
        
        // Create order
        const order = await Order.create({
            user: req.user.id,
            items,
            total,
            deliveryAddress,
            paymentMethod
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await seedData();
});