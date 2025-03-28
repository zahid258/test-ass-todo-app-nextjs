import { Gender } from "../../enums";

export interface IDefaultUserRequest {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth?: Date;
    phoneNum?: string;
    pictureUrl?: string;
}

export interface IUserRequest {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    gender: Gender;
    lastName: string;
    dateOfBirth?: Date;
    role: 'Admin' | 'User';
    phoneNum?: string;
    pictureUrl?: string;
}

export interface ISignUpRequest {
    userName: string;
    email: string;
    phoneNum?: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: Gender;
    dateOfBirth?: Date;
    pictureUrl?: string;
    address?: string;
    temporaryAddress?: string;
    country?: string;
    state?: string;
    city?: string; 
    zipCode?: number;
}