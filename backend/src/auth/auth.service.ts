import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService, private jwt: JwtService){}

    async register(dto: AuthDto){
        // generate password hash
        const hash = await argon.hash(dto.password)

        // save the user in db
        const user = await this.prisma.user.create({
            data:{
                email: dto.email,
                passwordHash: hash,
                role: dto.role
            }
        })

        await this.prisma.wallet.create({
            data: {
                userId: user.id,
            }
        })

        // return saved user
        return {
            "message": "user registred",
            userDetails: {
                email: user.email,
                role: user.role
            }
        }    
    }
    
    async login(dto: AuthDto){
        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        // if user does not exists then thow exception
        if (!user)
            throw new ForbiddenException(
                'Credentials incorrect'
            )

        // compare password
        const pwMatches = await argon.verify(user.passwordHash, dto.password)

        // if not match then exception
        if (!pwMatches)
            throw new ForbiddenException(
                'Credentials incorrect'
            )

        //send back the JWT payload 
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        const token = await this.jwt.signAsync(payload);

        return {
            message: 'user is logged in',
            access_token: token,
        };   
    }
}