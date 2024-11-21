const jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';
import {Request,Response} from 'express';
import { registerUser } from '../services/userService';
import { prisma } from '../prisma/client';
import { StatusCodes} from 'http-status-codes';

export const signupUser = async (req:Request,res:Response) =>{ 
    const {nom,email,motDePasse} = req.body;

    try {
        const user = await registerUser(nom,email,motDePasse);
        res.status(201).json({
            message:'Utilisateur créé avec succès',
            user:{
                id: user.id,
                nom:user.nom,
                email:user.email,
            },
        });
    } catch (error) {
        res.status(400).json({message: error});
        return;
    }
}
 
const JWT_SECRET = process.env.JWT_SECRET || 'johanna';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, motDePasse } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return; 
        }

        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Mot de passe incorrect' });
            return; 
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

        res.status(200).json({
            Message: 'Connexion réussie',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error });
        return;
    }
};



export const logoutUser = (req:Request, res:Response) =>{
    res.status(200).json({message: 'Déconnexion réussi'});
    return;
};

export const getUserProfile = async (req:Request, res:Response) =>{
    try {
        const user = await prisma.user.findUnique({
            where:{id:(req as any).user.id},
        });

        if (!user) {
            res.status(StatusCodes.BAD_REQUEST).json({message:'Utilisateur non Trouvé'});
            return;
        }

        res.status(StatusCodes.OK).json({user});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        return;
    }
};

 export const updateUserProfile = async (req:Request, res:Response) =>{
    const {nom,email,motDePasse} = req.body;

    try {
        const data:any = {};
        if(nom) data.nom = nom;
        if(email) data.email = email;
        if(motDePasse) data.motDePasse = await bcrypt.hash(motDePasse,10);

        const updatedUser = await prisma.user.update({
            where: {id:(req as any).user.id},
            data,
        });

        res.status(StatusCodes.OK).json({
            message:'Profil mis a jour avec succès',
            user: updatedUser,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error})
        return;
    }
 };

 export const deleteUserProfile = async (req: Request, res:Response) =>{
  try {
    await prisma.user.delete({
        where: {id:(req as any).user.id},
    });
    res.status(StatusCodes.OK).json({
        success: true,
        message:'Compte supprimé avec succès'
    });
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: `Internal server error: ${error}`
    });
  }  
 }