export interface IBook{
    id: number;
    name: string;
    description?: string;
    total: number;
    restInStock:number;
    createdAt: Date;
    updatedAt: Date;
}