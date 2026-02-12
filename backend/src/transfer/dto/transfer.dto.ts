import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class TransferDto {
    @IsString()
    @IsNotEmpty()
    recipientEmail: string

    @IsString()
    @IsNotEmpty()
    amount: string;

    // @IsString()
    // @IsNotEmpty()
    // note: string

}