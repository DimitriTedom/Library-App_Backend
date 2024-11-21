const jwt = require('jsonwebtoken');
import { Request,Response,NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const authenticateToken = (req:Request, res:Response, next:NextFunction) =>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({message:'Accès non autorisé'});
        return;
    }

    try {
        const user = jwt.verify(token,JWT_SECRET);
        (req as any).user = user;
        next();
    } catch (error) {
        res.status(403).json({message:'Token invaalid'});
    }
};