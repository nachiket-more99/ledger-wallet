import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PaymentDto {
    @IsString()
    @IsNotEmpty()
    amount: string;

    @IsString()
    @IsNotEmpty()
    provider: string
}

export class WebhookDto {
    @IsString()
    @IsNotEmpty()
    providerOrderId: string
}