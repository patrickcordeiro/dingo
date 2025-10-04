import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { loggerMiddleware } from './middlewares';
import env from './env';

function ensureHelmet(h: typeof helmet) {
  if (env.NODE_ENV === 'development') {
    return h.crossOriginResourcePolicy({ policy: 'cross-origin' });
  }
  return h();
}

const corsOptions: cors.CorsOptions = {
  origin: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'PATCH', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

const app: Application = express();
app.use(ensureHelmet(helmet));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(loggerMiddleware);
app.use(express.static('src/assets'));

app.get('/health', (req, res) => {
  res.json({
    data: { status: 'OK', timestamp: new Date().toISOString() },
  });
});

export default app;
