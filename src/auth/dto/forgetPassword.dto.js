import {isEmail } from "class-validator";

export class forgotPasswordDto {
    @isEmail()
    email!: string;

}
