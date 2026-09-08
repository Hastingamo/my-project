import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    resetToken!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(100)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
})
    newPassword!: string;

}