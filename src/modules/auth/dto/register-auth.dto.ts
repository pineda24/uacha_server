import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty } from "class-validator";
import { LoginAuthDto } from "./login-auth.dto";

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsNotEmpty()
    readonly fullName: string;

    @IsNotEmpty()
    readonly gender: string;

    @IsNotEmpty()
    readonly birthDate: Date;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly userName: string;
}