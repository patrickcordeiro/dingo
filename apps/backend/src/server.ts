import 'reflect-metadata';
import { Logger } from './logger';
import { custom404Middleware, errorMiddleware } from './middlewares';
import env from './env';
import app from './app';

Logger.info('🚧 Server is starting');

const serverPort = String(env.SERVER_PORT);

app.use(custom404Middleware);
app.use(errorMiddleware());

app.listen(serverPort, () => {
  Logger.systemStarted(serverPort);
});
