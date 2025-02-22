import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/User';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
const path = require('path');
import nodemailer, { createTransport } from 'nodemailer'
import {sendOtp} from '../Utilice/Mail';





const Storage = multer.diskStorage({
    destination: 'Users',
    filename: (req: any, file: any, cb: any) => {
        const unnifix = uuidv4()
        const fileextansction = path.extname(file.originalname)
        cb(null, file.fieldname + "-" + unnifix + fileextansction)
    }
})

const upload = multer({ storage: Storage });

interface Register {
    full_name?: string;
    email?: string;
    password?: string;
    image?: string;
}

router.post("/register", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { full_name, email, password }: Register = req.body;
        const ExistingUser = await UserModel.findOne({ email: email });
        if (ExistingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        } else {
            const NewUser = await UserModel.create({
                email: email,
                password: password,
                full_name: full_name,
                image: req.file?.filename
            });
            if (!NewUser) {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong, try again later"
                });
            } else {
                return res.status(201).json({
                    success: true,
                    message: "Registered successfully"
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
router.put("/update/:id", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const { full_name, email, password }: Register = req.body;
        const existingUser = await UserModel.findById(id);
        
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        } else {
            const updatedData: Partial<Register> = {
                full_name,
                email,
                password
            };
 
            if (req.file) {
                updatedData.image = req.file.filename;
            }
 
            const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
 
            if (!updatedUser) {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong, try again later"
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                    data: updatedUser
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
 });




// create a transport 





 function generateOTP() {
    // Generate a random number between 0 and 9999
    const otp = Math.floor(Math.random() * 10000);
    
    // Convert the number to a string and pad with leading zeros if necessary
    return otp.toString().padStart(4, '0');
}

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: Register = req.body;
        const User = await UserModel.findOne({ email: email, password: password });
        if (!User) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            });
        } else {

          const otp =  generateOTP();

          sendOtp(User.email,otp)
          await UserModel.findByIdAndUpdate(User._id,{
            otp:otp,
            activate:"activate"
          });
            
            return res.status(200).json({
                success: true,
                message: "Login Successful",
                User: User
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});



// verify otp
router.post("/verify-otp",async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,otp} = req.body;

        const user = await UserModel.findOne({email:email});

        if(!user){
            return res.status(404).json({
                success:false,
                message:"No user found with these email"
            })
        }else{
            const activate = await UserModel.findOne({otp:user.otp});

            if(activate){
                return res.status(200).json({
                    success:true,
                    message:"Verification completed"
                })
            }
        }

    }catch(error:any){
        console.log(error)
        return res.status(500).json({
            success:false,
            messge:"Internal server error"
        })
    }
})





router.get("/profile/:id", async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id as string;
    try {
        const User = await UserModel.findById(id);
        if (!User) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            });
        } else {
            return res.status(200).json({
                success: true,
                User: User
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});






export default router;
