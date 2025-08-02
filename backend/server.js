// Express app entry point
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Import routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const kotRoutes = require('./routes/kot');
const inventoryRoutes = require('./routes/inventory');
const tableRoutes = require('./routes/table');
const paymentRoutes = require('./routes/payment');
const notificationRoutes = require('./routes/notification');
const reportRoutes = require('./routes/report');
const branchRoutes = require('./routes/branch');
const reservationsRoutes = require('./routes/reservations');
const categoryRoutes = require('./routes/category_menuitem');
const menuItemRoutes = require('./routes/menu_item');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/kots', kotRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-items', menuItemRoutes);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
