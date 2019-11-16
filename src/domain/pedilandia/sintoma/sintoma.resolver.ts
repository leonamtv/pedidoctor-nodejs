import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { Sintoma, SintomaInput, SintomaUpdate } from './sintoma.model';
import { SintomaService } from './sintoma.service';
import { Roles } from '../../../common/security/user/roles.guard';

@Resolver(of => Sintoma)
export class SintomaResolver {

    constructor(
        private readonly service: SintomaService
    ) { }

    @Query(returns => [ Sintoma ])
    @Roles('user', 'cliente', 'gerente')
    async sintomas (
        @Args({ 
            name: 'query', 
            nullable: true,
            type: () => String 
        }) query?: string,
    ) {
        const condition = {};
        const projection = {};
        const sort = {};


        if(query !== undefined && query !== "") {
            condition['nome'] = new RegExp(`${query}`, 'i');
        }

       

        return await 
            this.service.findAll(condition, projection);
    }

    @Query(returns => Sintoma)
    @Roles('user', 'cliente', 'gerente')
    async sintoma ( @Args('id') id: string ) {
        return await this.service.findById(id);
    }

    @Mutation(returns => Sintoma)
    @Roles('user', 'cliente', 'gerente')
    async createSintoma ( @Args('obj') obj: SintomaInput ) {
        console.log(obj);
        return await this.service.create(obj);
    }

    @Mutation(returns => Sintoma, { nullable : true })
    @Roles('user', 'cliente', 'gerente')
    async deleteSintoma ( @Args('id') id: string ) {
        return await this.service.delete(id);
    }

    @Mutation(returns => Sintoma, { nullable : true })
    @Roles('user', 'cliente', 'gerente')
    async updateSintoma ( @Args('id') id: string, @Args('obj') obj: SintomaUpdate ) {
        return this.service.update(id, obj);
    }

}
