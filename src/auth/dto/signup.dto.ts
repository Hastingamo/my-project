import { IsEmail, IsString, MinLength, MaxLength, Matches, IsIn, IsOptional } from "class-validator";

export class SignupDto {
    
    @IsString()
    userName!: string; 

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(100)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
})
    password!: string;


     @IsIn(['buyer', 'seller', 'admin'])
  role!: string;

    @IsOptional()
  @IsString()
  adminKey?: string;
}