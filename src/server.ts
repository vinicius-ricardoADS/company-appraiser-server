import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import { resolve } from 'node:path';
import { uploadRoutes } from './routes/uploads';
import { productRoutes } from './routes/products';
import { companyRoutes } from './routes/company';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { evaluationRoutes } from './routes/evaluation';

const app = Fastify();

app.register(require('@fastify/formbody'))
app.register(multipart);

app.register(fastifyStatic, {
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
app.register(evaluationRoutes);

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333')
  });