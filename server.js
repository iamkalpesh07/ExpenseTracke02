require('dotenv').config();
const express = require('express');
const session = require("express-session");
const server = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("\x1b[32m%s\x1b[0m",'Communication established with bank')).catch((err) => console.error("\x1b[31m%s\x1b[0m", 'Bank Network Down: ', err));
server.use(express.json());
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.engine("ejs", ejsMate);
server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(session({
    secret: "CodeZero", 
    resave: false,        
    saveUninitialized: true,  
    cookie: { maxAge: 10 * 24 * 60 * 60 * 1000 } // 1 day
}));

// Importing routes
const userRoute = require('./routes/userRoute');
const transactionRoute = require('./routes/transactionRoute');
const authenticationRoute = require('./routes/authenticationRoute');
const subscriptionRoutes = require("./routes/subscription");
const goalRoutes = require("./routes/goal");
server.use('/user/', userRoute);
server.use('/transaction/', transactionRoute);
server.use('/authentication', authenticationRoute);
server.use("/subscription", subscriptionRoutes);
server.use("/goal", goalRoutes);

// Importing Models 
const User = require('./models/userModel');
const Transaction = require('./models/transactionModel');

// Routes
server.get("/createUser",(req, res)=>{
    res.render("userCreate");
})
server.get('/', (req, res) => {
    res.render('login');
})
server.get("/createTransaction",(req, res)=>{
    res.render("createTransaction");
})
server.get("/dashboard", async(req, res)=>{
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId).lean();
        const transactions = await Transaction.find({ user: userId }).sort({ date: -1 }).lean().limit(6);
    
        if (!user) return res.redirect('/authentication/login');
    
        const totalExpenses = transactions
          .filter(tx => tx.transactionType === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);
    
        const totalSavings = transactions
          .filter(tx => tx.transactionType === 'save')
          .reduce((sum, tx) => sum + tx.amount, 0);
    
        const allUserSavings = await Transaction.find({ user: userId, transactionType: 'save' }).lean();
        const savingsByGoal = {};
    
        allUserSavings.forEach(tx => {
          const goal = tx.goalName;
          if (goal) {
            savingsByGoal[goal] = (savingsByGoal[goal] || 0) + tx.amount;
          }
        });
    
        res.render('dashboard', {
          user,
          transactions,
          totalExpenses,
          totalSavings,
          savingsByGoal 
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
      }
})
server.get('/myid', (req, res) => {
    res.status(200).json({ data : req.session.userId});
})


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server listening at http://localhost:"+PORT);
});