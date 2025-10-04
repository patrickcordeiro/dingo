import { Request, Response } from 'express';
import { Logger } from '../logger';

export default (_req: Request, res: Response): Response => {
  Logger.debug('DEBUG', "Attempt to access a route that doesn't exist");
  return res.status(404).send();
};
