import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{
    register(){
        return "i am registred"
    }
    login(){
        return "i am logged in"
    }
}