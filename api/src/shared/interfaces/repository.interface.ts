export interface IRepository<T> {
  create(data: any): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<void>;
}
