import { Router } from 'express';
import { demandsRoutes } from './demands';

export const v1Routes = Router();

v1Routes.use('/demands', demandsRoutes);
