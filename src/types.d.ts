export {}

declare global {
  namespace Express {
    interface Request {
      user: {
        phoneNumber: string;
        firstName: string;
        time: string;
        iat: number;
        exp: number;
      }
    }
  }
}