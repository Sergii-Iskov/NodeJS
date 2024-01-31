import { Schema } from "mongoose";

export interface Task extends Document {
  id: number;
  name: string;
  text: string;
  checked: boolean;
}

export interface TaskList {
  items: Task[];
}

export interface User extends Document {
  name: string;
  password: string;
  [key: string]: any;
}

export const taskSchema: Schema = new Schema({
  id: {
    type: Number,
    require: [true, "Task description is required"],
  },
  name: {
    type: String,
    require: [true, "Task description is required"],
  },
  text: {
    type: String,
    require: [true, "Task description is required"],
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

export const userSchema: Schema = new Schema({
  name: {
    type: String,
    require: [true, "Task description is required"],
  },
  password: {
    type: String,
    require: [true, "Task description is required"],
  },
});
