import { Category } from "src/api/category/entities";

export class UpdateBookDto {
  readonly name?: string;
  readonly description?: string;
  readonly total?: number;
  readonly category?: Category;
}
