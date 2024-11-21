import nodemailer  from 'nodemailer';
import { Request,Response } from "express";
import { prisma } from "../prisma/client";
import { StatusCodes } from "http-status-codes";
import variable from '../variable';
export const borrowBook = async (req:Request, res:Response) =>{
    try {
        const {livreID,userID} = req.body;

        const book = await prisma.book.findUnique({
            where:{id:livreID},
        });
        if (!book) {
            res.status(StatusCodes.NOT_FOUND).json({
                message:"Livre non Trouvé."
            });
            return;
        }
        
        if (book.etat === "emprunté") {
            await prisma.notification.create({
                data:{
                    userID: userID,
                    livreID,
                    message: `Vous avez réservé le livre "${book.title}"`,
                },
            });

            res.status(StatusCodes.BAD_REQUEST).json({message:"Le Livre est deja emprunté"});
            return;
        }
        //Je peut maintenant creer l'emprunt
        const loan = await prisma.borrow.create({
            data:{
                livreID,
                userID,
                dateEmprunt: new Date(),
            },
        });
        //Bien sur je met a jour son etat
        await prisma.book.update({
            where:{id:livreID},
            data:{etat: "emprunté"},
        });

        res.status(StatusCodes.CREATED).json({
            message:"Livre emprunté avec succès",
            Borrow: loan,
        });
        return;
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"Erreur lors de l'emprunt."
        });
    }
};

const sendNotification = async (userEmail:string,message:string) =>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:variable.EMAIL_USER,
            pass:variable.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
        from:variable.EMAIL_USER,
        to:userEmail,
        subject: "Notification de disponibilité de livre",
        text:message,
    });
};

export const returnBook = async (req:Request, res:Response) =>{
    try {
        const {id} = req.params;

        const borrow = await prisma.borrow.findUnique({
            where: {id},
            include:{livre:true},
        });
        if (!borrow) {
            res.status(StatusCodes.NOT_FOUND).json({message:"Emprunt non Trouvé"});
            return;
        }
        if (borrow?.dateRetour) {
            res.status(StatusCodes.BAD_REQUEST).json({message:"Le livre a deja été retourné"});
            return;
        }

        await prisma.book.update({
            where:{id: borrow?.livreID},
            data:{etat:"disponible"},
        });

        const updatedBorrow = await prisma.borrow.update({
            where: {id},
            data: {dateRetour: new Date() },
        });

        const reservations = await prisma.notification.findMany({
            where:{livreID:borrow?.livreID},
            include:{user:true},
        });

        for (let reservation of reservations) {
            const message = `Bonjour Mr/Mme ${reservation.user.nom} Le livre ${borrow?.livre.title} est désormais disponible.`;
            await sendNotification(reservation.user.email,message);
            
            await prisma.notification.delete({
                where: {id:reservation.id},
            });
        }

        res.status(StatusCodes.OK).json({
            message:"Livre retourné avec succès et Notifications envoyées.",
            borrow: updatedBorrow,
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.BAD_REQUEST).json({
            message:"Erreur lors du retour du  livre",
            error:error,
        });
    }
};

export const getUserBorrowHist = async (req:Request, res:Response) =>{
    try {
        const {userIDreq} = req.params;

        const borrow = await prisma.borrow.findMany({
            where:{userID:userIDreq},
            include:{livre:true}
        });
        if (borrow.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({message:"Aucun emprunt trouvé pour cet utilisateur."});
            return;
        }
        res.status(StatusCodes.OK).json(borrow);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"Erreur lors de la recuperation de l'historique"
        });
    }
}
