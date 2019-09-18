import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { Empresa, EmpresaCreateInput, EmpresaUpdateInput } from './empresa.model';
import { EmpresaService } from './empresa.service';
import { PubSub } from 'graphql-subscriptions';
import { Roles } from '../../../common/security/user/roles.guard';
import { UserOwnerRule } from '../../../common/security/user/user-owner.rule.guard';


@Resolver(of => Empresa)
export class EmpresaResolver {

    pubSub = new PubSub();

    constructor(
        private readonly service: EmpresaService
    ) { }
    
    @Query(returns => [Empresa]) 
    @Roles('user')
    async empresas() {
        const objs = await this.service.findAll();
        return objs;
    }

    @Query(returns => [Empresa])
    async empresa() {
        const objs = await this.service.findAll();
        return objs;
    }


    @Mutation(returns => Empresa)
    async createEmpresa( @Args('obj') obj: EmpresaCreateInput ) {
        const created = await this.service.create(obj);

        this.pubSub.publish('empresaCreated', {empresaCreated: created});
        
        return created;
    }

    @Mutation(returns => Empresa, { nullable: true })
    async deleteEmpresa( @Args('id') id  : string) {
        return this.service.delete(id);
    }

    @Mutation(returns => Empresa, { nullable: true })
    @UserOwnerRule( (user, args) => user.id === args.id || true)
    async updateEmpresa(
        @Args('id') id : string, 
        @Args('obj') obj  : EmpresaUpdateInput
    ) {
        return this.service.update(id, obj);
    }

    @Subscription(returns => Empresa)
    empresaCreated() {
        return this.pubSub.asyncIterator('empresaCreated');
    }
}
