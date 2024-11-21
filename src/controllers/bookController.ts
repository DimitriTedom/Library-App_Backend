import { Book } from './../../node_modules/.prisma/client/index.d';
import { Request,Response } from "express";
import { prisma } from "../prisma/client";
import { StatusCodes } from 'http-status-codes';

export const createBook = async (req:Request, res:Response) =>{
    const {title,author,description,publishYear,ISBN} = req.body;

    try {
        const book = await prisma.book.create({
            data:{
                title,
                author,
                description,
                publishYear,
                ISBN,
            }
        });


    res.status(201).json({
        message: 'Livre créé avec succès',
        book,
      });
    } catch (error) {
        res.status(400).json({
            message:error
        });
    }
};

export const getBooks = async (req:Request,res:Response)=>{
    try {
        const book = await prisma.book.findMany()
        res.status(StatusCodes.OK).json(book);

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({message:'Erreur lors de la récupération des livres'});
    }
};

export const addBook = async (req:Request, res:Response) =>{
    const {title,author,description,publishYear,ISBN}= req.body;

    try {
        const newBook = await prisma.book.create({
            data:{
                title,
                author,
                description,
                publishYear,
                ISBN,
            },
        });
        res.status(StatusCodes.CREATED).json({
            message: 'Livre ajouté avec succès',
            book: newBook,
        })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({message:'Erreur lors de l\'ajout du livre',error});
    }
};

export const updateBook = async (req:Request, res:Response) =>{
    const {id} = req.params;
    const {title,author,description,publishYear,ISBN} = req.body;

    try {
       const updatedBook = await prisma.book.update({
        where:{id},
        data:{
            title,
            author,
            description,
            publishYear,
            ISBN,
        },
       });

       res.status(StatusCodes.OK).json({
        Message:'Livre mis a jour avec succès',
        book:updatedBook,
       });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'Erreur lors de la mise à jour du livre', error: error})
    }
};

export const deleteBook = async (req:Request, res:Response) =>{
    const {id}=req.params;

    try {
        await prisma.book.delete({where: {id} });
        res.status(StatusCodes.OK).json({
            message: 'Livre supprimé avec succès'
        })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message:'Erreur lors de la suppression du livre', 
            error: error
        })
    }
}