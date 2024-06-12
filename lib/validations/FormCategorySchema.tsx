import  * as z from "zod"


export const formCategorySchema = z.object({
    categoryId : z.string().min(1)
})