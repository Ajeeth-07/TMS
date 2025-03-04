import {Request, Response, NextFunction, RequestHandler} from "express";
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

export const authMiddleware : RequestHandler = (req: Request, res:Response, next:NextFunction) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
             res.status(401).json({message:"Authentication required"});
             return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback_secret"
        ) as TokenPayload;

        req.userId = decoded.id;
        next();
    }catch(error){
        console.error(error);
        res.status(401).json({message:"Invalid or expired token"});
    }
};