import { TaskStatus } from "../../enums/task-status.enum";
import { IAccountResponseBase } from "./response-base";
import { IUserResponse } from "./user";

export interface IToDoResponse extends IAccountResponseBase {
    todo: string;
    details: string;
    userId?: string;
    status: TaskStatus;
    dueDate: Date;
    user?: IUserResponse
}
