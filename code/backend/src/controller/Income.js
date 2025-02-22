import { Router } from "express";
import { Request,Response,NextFunction } from "express";
import ExpensivModel from "../models/Income";
import IncomeModel from "../models/Expence";
import UserModel from "../models/User";
import mongoose from "mongoose";
const router = Router()



///Added Expensive
router.post('/add-income/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id :string = req.params.id as string;
    try{
        const {title, amount, category, description,date}  = req.body
        if(amount <0) {
            return res.status(400).json({
                success:false,
                message:"amount is postive intiger"
            })
        }
        const NewExpensive = await ExpensivModel.create({
            user:id,
            title,
             amount, 
             category, 
             description, 
             date
        })
        if(NewExpensive){
            return res.status(201).json({
                success:true,
                message:"income Added"
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

///get the expensive
router.get('/get-incomes/:id',async(req:Request,res:Response,next:NextFunction)=>{
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
router.delete('/delete-income/:expensiveid',async(req:Request,res:Response,next:NextFunction)=>{
   
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

router.get('/search-income/:id', async (req: Request, res: Response, next: NextFunction) => {
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




// get the month or yearly report
// router.get('/get-incomes-month/:id', async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const monthYear = req.query.month as string; // Expecting 'YYYY-MM' format if provided
//     const yearOnly = req.query.year as string; // Expecting 'YYYY' format if provided

//     try {
//         const query: any = { user: new mongoose.Types.ObjectId(id) };

//         // If a month is provided in 'YYYY-MM' format
//         if (monthYear) {
//             const [parsedYear, parsedMonth] = monthYear.split('-').map(Number);

//             // Check if both year and month are valid numbers
//             if (!isNaN(parsedYear) && !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
//                 // Set the query to match the start and end of the given month
//                 const startOfMonth = new Date(parsedYear, parsedMonth - 1, 1); // First day of the month
//                 const endOfMonth = new Date(parsedYear, parsedMonth, 0); // Last day of the month

//                 query.date = {
//                     $gte: startOfMonth,
//                     $lt: new Date(endOfMonth.getFullYear(), endOfMonth.getMonth(), endOfMonth.getDate() + 1)
//                 };
//             } else {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid month format. Expected 'YYYY-MM'"
//                 });
//             }
//         }

//         // If only a year is provided
//         else if (yearOnly) {
//             const parsedYear = parseInt(yearOnly, 10);

//             if (!isNaN(parsedYear)) {
//                 // Set the query to match the start and end of the given year
//                 const startOfYear = new Date(parsedYear, 0, 1); // First day of the year
//                 const endOfYear = new Date(parsedYear + 1, 0, 1); // First day of the next year

//                 query.date = {
//                     $gte: startOfYear,
//                     $lt: endOfYear
//                 };
//             } else {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid year format. Expected 'YYYY'"
//                 });
//             }
//         }

//         const result = await IncomeModel.aggregate([{ $match: query }]);

//         if (result.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No income found for this user in the specified period"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: result
//         });

//     } catch (error) {
//         console.error('Error fetching incomes:', error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// });


router.get('/get-expense/:id', async (req: any, res: Response, next: NextFunction) => {
    const id: string = req.params.id as string;
    const month = req.query.month; // expecting format 'YYYY-MM'
    const year = req.query.year; // expecting format 'YYYY'

    try {
        const users = await UserModel.find({user:id});
         
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            let result:any;

            // If a specific month is provided (e.g. 'YYYY-MM')
            if (month) {
                const [parsedYear, parsedMonth] = month.split('-').map(Number);

                if (!isNaN(parsedYear) && !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
                    // Calculate the next month and handle year transition
                    let nextYear = parsedYear;
                    let nextMonth = parsedMonth + 1;

                    if (nextMonth === 13) { // If month is December, move to January of the next year
                        nextMonth = 1;
                        nextYear += 1;
                    }

                    result = await IncomeModel.aggregate([
                        {
                            $match: {
                                user: new mongoose.Types.ObjectId(id),
                                date: {
                                    $gte: new Date(`${parsedYear}-${parsedMonth}-01`),  // Start of the given month
                                    $lt: new Date(`${nextYear}-${nextMonth}-01`)  // Start of the next month
                                }
                            }
                        },
                    ]);
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid month format. Expected 'YYYY-MM'"
                    });
                }
            }

            // If only the year is provided
            else if (year) {
                const parsedYear = parseInt(year, 10);

                if (!isNaN(parsedYear)) {
                    result = await IncomeModel.aggregate([
                        {
                            $match: {
                                user: new mongoose.Types.ObjectId(id),
                                date: {
                                    $gte: new Date(`${parsedYear}-01-01`),  // Start of the given year
                                    $lt: new Date(`${parsedYear + 1}-01-01`)  // Start of the next year
                                }
                            }
                        },
                    ]);
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid year format. Expected 'YYYY'"
                    });
                }
            }
            
             // Return the result
             if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No income records found for this user in the specified time period"
                });
            } else {
                return res.status(200).json({
                    success: true,
                    data: result
                });
            }
           
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});























// router.get('/get-incomes-month/:id', async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const month = req.query.month as string;
//     const year = req.query.year as string;

//     try {
//         const query: any = { user: new mongoose.Types.ObjectId(id) };

//         if (month && year) {
//             const parsedYear = parseInt(year, 10);
//             const parsedMonth = parseInt(month, 10);

//             if (!isNaN(parsedYear) && !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
//                 query.date = {
//                     $gte: new Date(parsedYear, parsedMonth - 1, 1),
//                     $lt: new Date(parsedYear, parsedMonth, 0) // Last day of the month
//                 };
//             } else {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid month or year"
//                 });
//             }
//         }

//         const result = await IncomeModel.aggregate([
//             { $match: query }
//         ]);

//         if (result.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No income found for this user in the specified month/year"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: result
//         });

//     } catch (error) {
//         console.error('Error fetching incomes:', error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// });


// router.get('/get-incomes-month/:id', async (req: Request, res: Response, next: NextFunction) => {
//     const id: string = req.params.id;
//     const monthYear: string | undefined = req.query.month as string; // Expecting 'YYYY-MM'

//     try {
//         let query: any = {
//             user: new mongoose.Types.ObjectId(id)
//         };

//         if (monthYear) {
//             // Split the monthYear string to get the year and month
//             const [year, month] = monthYear.split('-').map((val) => parseInt(val));

//             // Ensure that valid numeric year and month values are provided
//             if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
//                 query.date = {
//                     $gte: new Date(year, month - 1, 1), // Start of the month
//                     $lt: new Date(year, month, 1)       // Start of the next month
//                 };
//             } else {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid month or year format. Expected format is YYYY-MM."
//                 });
//             }
//         }

//         const result = await IncomeModel.aggregate([
//             {
//                 $match: query
//             }
//         ]);

//         if (result.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No income found for this user in the specified month."
//             });
//         }

//         // Send the result if data is found
//         return res.status(200).json({
//             success: true,
//             data: result
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// });




router.get('/get-incomes-month/:id', async (req: any, res: Response, next: NextFunction) => {
    const id: string = req.params.id as string;
    const month = req.query.month; // expecting format 'YYYY-MM'
    const year = req.query.year; // expecting format 'YYYY'

    try {
        const users = await UserModel.find({user:id});
         
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            let result:any;

            // If a specific month is provided (e.g. 'YYYY-MM')
            if (month) {
                const [parsedYear, parsedMonth] = month.split('-').map(Number);

                if (!isNaN(parsedYear) && !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
                    // Calculate the next month and handle year transition
                    let nextYear = parsedYear;
                    let nextMonth = parsedMonth + 1;

                    if (nextMonth === 13) { // If month is December, move to January of the next year
                        nextMonth = 1;
                        nextYear += 1;
                    }

                    result = await ExpensivModel.aggregate([
                        {
                            $match: {
                                user: new mongoose.Types.ObjectId(id),
                                date: {
                                    $gte: new Date(`${parsedYear}-${parsedMonth}-01`),  // Start of the given month
                                    $lt: new Date(`${nextYear}-${nextMonth}-01`)  // Start of the next month
                                }
                            }
                        },
                    ]);
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid month format. Expected 'YYYY-MM'"
                    });
                }
            }

            // If only the year is provided
            else if (year) {
                const parsedYear = parseInt(year, 10);

                if (!isNaN(parsedYear)) {
                    result = await ExpensivModel.aggregate([
                        {
                            $match: {
                                user: new mongoose.Types.ObjectId(id),
                                date: {
                                    $gte: new Date(`${parsedYear}-01-01`),  // Start of the given year
                                    $lt: new Date(`${parsedYear + 1}-01-01`)  // Start of the next year
                                }
                            }
                        },
                    ]);
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid year format. Expected 'YYYY'"
                    });
                }
            }
            
             // Return the result
             if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No income records found for this user in the specified time period"
                });
            } else {
                return res.status(200).json({
                    success: true,
                    data: result
                });
            }
           
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
   








export default router