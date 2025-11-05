import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id?: string;
        email?: string;
        role?: string;
      };
    }
  }
}
declare global {
  namespace Express {
    export interface Request {
      file?: File & { path: string };
      files?: (File & { path: string })[];
    }
  }
}

declare global {
  namespace Express {
    interface UserPayload {
      id?: string;
      email?: string;
      role?: string;
    }

    interface Request {
      user?: UserPayload;
      file?: Express.Multer.File & { path: string };
      files?: (Express.Multer.File & { path: string })[];
    }
  }
}