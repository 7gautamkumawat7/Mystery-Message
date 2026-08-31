import {z} from "zod";

export const verifySchema = z.object({
    code: z.string().min(6).max(6 , {message : "Code must be 6 characters long"}),
    

})