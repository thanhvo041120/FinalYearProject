import { Category } from "src/api/category/entities";

export interface IBook{
    id: number;
    name: string;
    description?: string;
    total: number;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}