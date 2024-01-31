export interface Task {
  id: number;
  name: string;
  text: string;
  checked: boolean;
}

export interface TaskList {
  items: Task[];
}

export interface User {
  name: string;
  pass: string;
}

export interface UserList {
  users: User[];
}
