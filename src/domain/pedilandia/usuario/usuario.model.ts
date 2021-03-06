import { UsoMedicamentoInput, UsoMedicamentoUpdate } from './usomedicamento.model';
import { UsoMedicamento } from './usomedicamento.model';
import { AcontecimentoInput, AcontecimentoUpdate } from '../acontecimento/acontecimento.model';

import { ObjectType, InputType, Field, ID, Int } from 'type-graphql';
import { Acontecimento } from '../acontecimento/acontecimento.model';
import { IsString, IsArray } from 'class-validator';
import { prop, Typegoose, arrayProp } from '@typegoose/typegoose';
import { BaseUpdate } from '../../../common/general/shared/base-update.model';

@ObjectType()
export class AtribuicaoUsuarioModel {
    @Field(type => [String], { nullable: true })
    cliente: string[];

    @Field(type => [String], { nullable: true })
    gerente: string[];

    @Field(type => [String], { nullable: true })
    medico: string[];

    @Field(type => [String], { nullable: true })
    secretario: string[]; 
}

@ObjectType()
export class Usuario extends Typegoose {

    constructor(values = null) {
        super();

        Object.assign(this, values);
    }

    @Field(type => ID)
    _id: string;

    @IsString()
    @prop()
    firebaseUid: string;

    @IsString()
    @prop( { required: true } )
    @Field()
    nome: string

    @IsString()
    @prop({ required: true, unique: true })
    @Field()
    email: string;

    @IsString()
    @prop({ required: false })
    senha: string;

    @IsString()
    @prop({ required: false })
    @Field({ nullable: true })
    telefone: string;

    @IsString()
    @prop({ required: false })
    @Field({ nullable: true })
    fotoUrl: string;

    @IsArray()
    @prop({ required: false })
    @Field(type => [String], { nullable: false })
    roles: string[];

    @IsArray()
    @Field(type => AtribuicaoUsuarioModel, { nullable: true })
    atribuicoes: AtribuicaoUsuarioModel;

    @prop({ required: false })
    @Field(type => Int)
    tipo: number = 0;

    @Field(type => Int, { nullable: true })
    qtConsultas: number;
    
    /**
     * Usuário pode ser o pai ou a criança.
     * Se for criança, isPaciente = true
     */
    @prop()
    @Field({ nullable: true })
    isPaciente: boolean;
    
    @arrayProp({ itemsRef: Usuario, required: true })
    @Field(type => [Usuario], { nullable: true} )
    responsavelPor : Usuario[];
    
    @arrayProp({ itemsRef: Usuario, required: true })
    @Field(type => [UsoMedicamento], { nullable: true} )
    usoMedicamentos : UsoMedicamento[];

    @Field(type => [Acontecimento], { nullable: true} )
    acontecimentos : Acontecimento[];
}

@InputType()
export class UsuarioInput {

    @Field(type => String, { nullable: false })
    nome: string

    @Field(type => String, { nullable: false })
    email: string;

    @Field(type => String, { nullable: true })
    senha: string;

    @Field(type => Int, { nullable: true })
    tipo: number;

    @Field(type => Int, { nullable: true })
    qtConsultas: number = 0;

    @Field()
    isPaciente: boolean;

    @Field({ nullable: true })
    telefone: string;

    @Field(type => [UsuarioInput], { nullable: true} )
    responsavelPor : Usuario[];

    @Field(type => [UsoMedicamentoInput], { nullable: true} )
    usoMedicamentos : UsoMedicamentoInput[];

    @Field(type => [AcontecimentoInput], { nullable: true} )
    acontecimentos : AcontecimentoInput[];
}

@InputType()
export class UsuarioUpdate extends BaseUpdate {
    @Field(type => String, { nullable: true })
    nome?: string
    @Field({ nullable: true })
    telefone?: string;
    @Field(type => Int, { nullable: true })
    qtConsultas?: number = 0;
    @Field(type => String, { nullable: true })
    email? : string;

    @Field(type => String, { nullable: true })
    senha?: string;

    @Field(type => Int, { nullable : true})
    tipo? : number;
    
    @Field(type => Boolean, { nullable: true} )
    isPaciente? : boolean;

    @Field(type => [UsuarioUpdate], { nullable: true} )
    responsavelPor? : Usuario[];
    @Field(type => [UsoMedicamentoUpdate], { nullable: true} )
    usoMedicamentos? : UsoMedicamentoUpdate[];
    @Field(type => [AcontecimentoUpdate], { nullable: true} )
    acontecimentos? : AcontecimentoUpdate[];
}
