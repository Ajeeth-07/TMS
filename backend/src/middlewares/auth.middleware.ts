import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

interface TokenPayload{
    id:number;
}

declare global{
    namespace Express{
        interface Request{
            userId? : number;
        }
    }
}

export const authMiddleware = (req: Request, res:Response, next:NextFunction) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({message:"Authentication required"});
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback_secret"
        ) as TokenPayload;

        req.userId = decoded.id;
        next();
    }catch(error){
        res.status(401).json({message:"Invalid or expired token"});
    }
};