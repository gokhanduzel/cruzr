import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Check if there's actually an Authorization header
  if (!req.headers.authorization) {
    // If not, skip authentication for this execution.
    return next();
  }
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN_HERE

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid token

    // Stricter type guard
    if (!isJwtWithIdPayload(decoded)) {
      return res.sendStatus(403);
    }
    
    const userId = new mongoose.Types.ObjectId(decoded.id.toString());
    req.user = { id: userId } ;
    console.log("req.user: ", req.user);
    console.log('userId: ', userId);
    next();
  });
};

// Helper function for type check
function isJwtWithIdPayload(
    payload: unknown
): payload is JwtPayload & { id: mongoose.Schema.Types.ObjectId } { 
    return typeof payload === 'object' && payload !== null && 'id' in payload;
}


export default authenticate;
