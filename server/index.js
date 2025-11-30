// import { Hono } from 'hono';
// import { cors } from 'hono/cors';

// const app = new Hono().basePath('/api');

// // CORS middleware
// app.use('*', cors());

// // Routes
// import authRoutes from './routes/authRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import submissionRoutes from './routes/submissionRoutes.js';
// import evaluatorRoutes from './routes/evaluatorRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';
// import projectRoutes from './routes/projectRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import companyRoutes from './routes/companyRoutes.js';

// app.route('/auth', authRoutes);
// app.route('/admin', adminRoutes);
// app.route('/submissions', submissionRoutes);
// app.route('/evaluator', evaluatorRoutes);
// app.route('/payment', paymentRoutes);
// app.route('/projects', projectRoutes);
// app.route('/users', userRoutes);
// app.route('/companies', companyRoutes);

// app.get('/', (c) => {
//   return c.text('Shyoski API is running...');
// });

// app.get('/api/health', (c) => {
//   return c.text('OK');
// });

// export default app;




import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono().basePath('/api');

// CORS middleware
app.use('*', cors());

// Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import evaluatorRoutes from './routes/evaluatorRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/companyRoutes.js';

app.route('/auth', authRoutes);
app.route('/admin', adminRoutes);
app.route('/submissions', submissionRoutes);
app.route('/evaluator', evaluatorRoutes);
app.route('/payment', paymentRoutes);
app.route('/projects', projectRoutes);
app.route('/users', userRoutes);
app.route('/companies', companyRoutes);

// Root under /api/
app.get('/', (c) => {
  return c.text('Shyoski API is running...');
});
app.get('', (c) => {
  return c.redirect('/api/', 301);
});

// HEALTH is /api/health thanks to basePath('/api')
app.get('/health', (c) => {
  return c.text('OK');
});

export default app;
