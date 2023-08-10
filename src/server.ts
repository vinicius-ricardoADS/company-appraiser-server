import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { resolve } from 'node:path';
import jwt from '@fastify/jwt';
import { uploadRoutes } from './routes/uploads';
import { productRoutes } from './routes/products';
import { companyRoutes } from './routes/company';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';

const app = Fastify();

app.register(require('@fastify/formbody'))
app.register(multipart);

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: 'companyappraiser',
});

app.register(authRoutes);
app.register(userRoutes);
app.register(uploadRoutes);
app.register(productRoutes);
app.register(companyRoutes);

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333')
  });