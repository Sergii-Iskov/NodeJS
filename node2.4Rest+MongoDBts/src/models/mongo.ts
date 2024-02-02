import mongodb, { OptionalId, Document } from "mongodb";

export declare type Task = OptionalId<Document> & {
  id: number;
  name: string;
  text: string;
  checked: boolean;
};

export interface TaskList {
  items: Task[];
}

export declare type User = OptionalId<Document> & {
  name: string;
  pass: string;
};
