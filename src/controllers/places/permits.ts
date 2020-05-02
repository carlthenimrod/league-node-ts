import { Router, Request, Response, NextFunction } from 'express';

const permitsRouter = Router({ mergeParams: true });

interface SavePermitRequest extends Request {
  params: { id: string };
}

const savePermit = async (
  req: SavePermitRequest,
  res: Response,
  next: NextFunction
) => {

};

const updatePermit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
};

const deletePermit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
};

permitsRouter.post('/', savePermit);
permitsRouter.put('/:permitId', updatePermit);
permitsRouter.delete('/:permitId', deletePermit);

export default permitsRouter;