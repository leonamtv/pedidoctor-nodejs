import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { jwt as jwtInfo } from '../../../common/config/config.service';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';



/**
 * Essa dependência é utilizada para validar o token JWT e definir o objeto de usuário.
 * 
 * TODO: Talvez seja mais adequado semânticamente usar Interceptors: https://docs.nestjs.com/interceptors, pois
 * esse Guard não é restritivo, apenas verifica a existência de um token
 */
@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly userService: UserService) { }
    
    getRequest(context: ExecutionContext) : Request {
        let req = context.switchToHttp().getRequest();

        if(req == undefined) {
            const gqlContext = GqlExecutionContext.create(context);
            req = gqlContext.getContext().req;
        }
        
        return req;
    }
    
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = this.getRequest(context);
        const authHeader = req.headers['authorization'];

        try {
            if(authHeader != undefined) {
                const s = authHeader.split(' ');
                if(s[0] === 'Bearer') {
                    const payload = jwt.verify(
                        s[1], 
                        jwtInfo.secret, 
                        {
                            ignoreExpiration: false
                        }
                    );

                    req['user'] = await this.userService.findByFirebaseUid( payload['uid'] );
                }
            }
        } catch(e) {
            console.error(e);
        }

        return true;
    }
}