import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

export const getTasks = async(req:Request, res:Response, next:NextFunction) => {
    try{
        const tasks = await prisma.task.findMany({
            where:{authorId: req.userId}
        });

        res.json(tasks);
    }catch(err){
        res.status(500).json({message:"Server error" + err})
    }
}

export const getTaskById = async(req:Request & {userId?:number}, res:Response, next:NextFunction) : Promise<void> => {

    try{
        const task = await prisma.task.findUnique({
            where:{
                id: parseInt(req.params.id),
            }
        });

        if(!task){
             res.status(404).json({message:"Task not found"});
             return;
        }

        if(task.authorId !== req.userId){
             res.status(404).json({message:"Not authorized"});
             return;
        }

        res.json(task);
    }catch(err){
        res.status(500).json({message:"Server error" + err});
    }
};

export const createTask = async(req:Request & {userId?:number}, res:Response) => {
    try{
        const {title, content,dueDate,priority} = req.body;

        const task = await prisma.task.create({
            data:{
                title,
                content,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                priority,
                authorId:req.userId!
            }
        });

        res.status(201).json(task)
    }catch(err){
        res.status(500).json({message:"Server error" + err})
    }
};

export const updateTask = async(req:Request & {userId?:number}, res:Response,) : Promise<void> => {
    try{ 

        const {title, content, completed, dueDate, priority} = req.body;

        //check if task exists and belongs to user
        const existingTask = await prisma.task.findUnique({
            where : {id:parseInt(req.params.id)}
        });

        if(!existingTask){
             res.status(404).json({message:"task not found"});
             return;
        }

        if(existingTask.authorId !== req.userId){
             res.status(403).json("Not authorised");
             return;
        }

        const task = await prisma.task.update({
            where:{id:parseInt(req.params.id)},
            data:{
                title,
                content,
                completed,
                dueDate:dueDate ? new Date(dueDate) : undefined,
                priority
            }
        });

        res.json(task);

    }catch(err){
        res.status(500).json({message:"Server error" + err});
    }
};

export const deleteTask = async(req:Request & {userId?:number}, res:Response) : Promise<void> => {
    try{
        //check if task exists and belongs to user
        const existingTask = await prisma.task.findUnique({
            where:{id:parseInt(req.params.id)}
        });

        if(!existingTask){
             res.status(404).json({message:"task not found"});
             return;
        }

        if(existingTask.authorId !== req.userId){
             res.status(403).json({message:"Not authorised"});
             return;
        }

        await prisma.task.delete({
            where:{id:parseInt(req.params.id)}
        });

        res.json({message:"task deleted"});
    }catch(err){
        res.status(500).json({message:"Server error" + err})
    }
}