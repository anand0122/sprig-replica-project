import { ZodError } from 'zod';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: 'ValidationError', message: e.errors?.[0]?.message });
      }
      next(e);
    }
  };
}; 