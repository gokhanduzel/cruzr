declare namespace Express {
  export interface Request {
      user?: {
          id: mongoose.Schema.Types.ObjectId; 
      };
  }
}
