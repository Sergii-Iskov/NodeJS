import mongodb, { OptionalId, Document } from "mongodb";

export declare type Task = OptionalId<Document> & {
  // _id?: mongodb.BSON.ObjectId | undefined;
  id: number;
  name: string;
  text: string;
  checked: boolean;
}; // https://jira.mongodb.org/browse/NODE-4470

export interface TaskList {
  items: Task[];
}

export declare type User = OptionalId<Document> & {
  name: string;
  pass: string;
};
