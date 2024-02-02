import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  name: string;
  pass: string;
}
