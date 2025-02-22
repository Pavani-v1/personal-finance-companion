import { Router } from "express";
import { Request,Response,NextFunction } from "express";
import ExpensivModel from "../models/Expence";
import UserModel from "../models/User";
import IncomeModel from "../models/Income";
import mongoose from "mongoose";
const router = Router();
import {sendIncomeLess} from '../Utilice/Mail'














///Added Expensive
// router.post('/add-expense/:id',async(req:Request,res:Response,next:NextFunction)=>{
//     const id :string = req.params.id as string;
//     try{
//         const {title, amount, category, description,date}  = req.body
//         const user = await UserModel.findById(id)
//         if(!user){
//             return res.status(404).json({
//                 success:false,
//                 message:"User not found"
//             })
//         }
//         const income = await IncomeModel.aggregate([
//             {
//                 $match:{
//                     user: new mongoose.Types.ObjectId(id),
//                 }
//             },
//             {
//                 $group:{
//                     _id:null,
//                     totalExpensive:{$sum:"$amount"}
//                 }
//             }
//         ])

//         if (amount > income){
//             return res.status(400).json({
//                 success:false,
//                 message:"amount is greater than total income"
//             })
//         }
        
//         if(amount <0) {
//             return res.status(400).json({
//                 success:false,
//                 message:"amount is postive intiger"
//             })
//         }
//         const NewExpensive = await ExpensivModel.create({
//             user:id,
//             title,
//              amount, 
//              category, 
//              description, 
//              date
//         })
//         if(NewExpensive){
//             return res.status(201).json({
//                 success:true,
//                 message:"Expensive Added"
//             })
//         }

//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"internal server error"
//         })
        
//     }
// })
router.post('/add-expense/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id as string;

    try {
        const { title, amount, category, description, date } = req.body;

        // Validate request body
        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount should be a positive number"
            });
        }

        // Find the user by ID
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Calculate total expenses
        const expenseResult = await ExpensivModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(id),
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: "$amount" }
                }
            }
        ]);

        const totalExpense = expenseResult.length > 0 ? expenseResult[0].totalExpense : 0;

        // Calculate total income
        const incomeResult = await IncomeModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(id),
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$amount" }
                }
            }
        ]);

        const totalIncome = incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;

        
// console.log(amount+totalExpense);

        // Check if the expense exceeds total income
        if (parseFloat(amount) + parseFloat(totalExpense) > totalIncome) {
            return res.status(400).json({
                success: false,
                message: "Amount exceeds the total income"
            });
        }

        // Create new expense
        const newExpense = await ExpensivModel.create({
            user: id,
            title,
            amount,
            category,
            description,
            date
        });

        const income  = await IncomeModel.aggregate(
            [
                {
                  '$match': {
                    'user': new mongoose.Types.ObjectId(id)
                  }
                }, {
                  '$group': {
                    '_id': '$user', 
                    'sum': {
                      '$sum': '$amount'
                    }
                  }
                }
              ]
        );


        console.log(income,"income")


        const totalexpence = await ExpensivModel.aggregate(
            [
                {
                  '$match': {
                    'user': new mongoose.Types.ObjectId(id)
                  }
                }, {
                  '$group': {
                    '_id': '$user', 
                    'sum': {
                      '$sum': '$amount'
                    }
                  }
                }
              ]
        );

        console.log(totalexpence[0].sum ,"total expeksng");


        
        if (newExpense) {
            const reasult = income[0].sum - totalexpence[0].sum;

        console.log(reasult,"reasult")

        if(reasult < 1000){
            sendIncomeLess(user.email,reasult)
        }
        
            return res.status(201).json({
                success: true,
                message: "Expense added successfully"
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
///get the expensive
router.get('/get-expenses/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id : string = req.params.id as string
    try{
        const User = await UserModel.findById(id)
        if(!User){
            return res.status(404).json({
                success:false,
                message:"internal server error"
            })
        }else{
            const expensives = await ExpensivModel.find({user:id}).exec()
            if(expensives.length === 0){
                return res.status(404).json({
                    success:false,
                    message:"no expensive found"
                })
            }else{
                return res.status(200).json({
                    success:true,
                    expensives:expensives
                })
            }
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
        
    }
})

///delete the expensive
router.delete('/delete-expense/:expensiveid',async(req:Request,res:Response,next:NextFunction)=>{

    const expensiveid : string = req.params.expensiveid as string
    try{
       
        const responce = await ExpensivModel.findByIdAndDelete(expensiveid)
        if(responce){
            return res.status(200).json({
                success:true,
                message:"deleted successfully"
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
})



type Search = {
    title?: string;
    date?: string; // Kept as string since query parameters are received as strings
};

router.get('/search-expense/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id as string;
    const { title, date }: Search = req.query;

    try {
        console.log(date)
        const match: any = {
            user: new mongoose.Types.ObjectId(id)
        };

        if (title) {
            match.title = new RegExp(title, 'i');
        }

        if (date) {
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
                const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
                match.date = { $gte: startOfDay, $lt: endOfDay };
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format"
                });
            }
        }

        const data = await ExpensivModel.aggregate([
            {
                $match: match
            }
        ]);

        return res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// router.get(`search-transactions/:id`,async (req:Request, res:Response, next:NextFunction) => {
//     const {id} = req.params;
//     const { searchTerm, startDate,} = req.query;
//     try {
//         const user = await UserModel.findById(id);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }
//         if(searchTerm || startDate ){
//             const startDateFilter = startDate? new Date(startDate) : new Date(0);
//             const searchTermRegex = new RegExp(searchTerm, 'i');
//             const expenses = await ExpensivModel.find({
//                 user: id,
//                 title: searchTermRegex,
//                 date: { $gte: startDateFilter }
//             }).exec();

//             return res.status(200).json({
//                 success: true,
//                 expenses
//             });
//         }
        
       
        
//     } catch (error) {
        
//     }

// })


export default router