import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface JwtPayload {
  id: string;
}

// Mở rộng interface Request để có `user`
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Không tìm thấy người dùng' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
  }

  return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
};

export const userOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === 'user') return next();
  return res.status(403).json({ message: 'Chỉ user được phép' });
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Chỉ admin được phép thao tác' });
};
