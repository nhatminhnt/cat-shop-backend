import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler, notFound } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import catRoutes from './routes/cat.routes';
// import orderRoutes from './routes/order.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cats', catRoutes);
// app.use('/api/orders', orderRoutes);

// Error Handler
app.use(notFound);
app.use(errorHandler);

export default app;
