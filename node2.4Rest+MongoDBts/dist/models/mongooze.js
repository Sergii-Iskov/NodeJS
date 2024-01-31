import { Schema } from "mongoose";
export const taskSchema = new Schema({
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
export const userSchema = new Schema({
    name: {
        type: String,
        require: [true, "Task description is required"],
    },
    password: {
        type: String,
        require: [true, "Task description is required"],
    },
});
