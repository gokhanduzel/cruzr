import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN_HERE

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid token

    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      req.user = { id: decoded.id }; // Safely assign knowing decoded has an id
      next();
    } else {
      // Handle case where decoded doesn't match the expected shape
      return res.sendStatus(403);
    }
  });
};

export default authenticate;
