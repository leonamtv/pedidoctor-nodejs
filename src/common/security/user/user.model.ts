import * as mongoose from 'mongoose';

import { prop, Typegoose } from 'typegoose';
import { IsString, IsArray } from 'class-validator';
import { ObjectType, InputType, Field, ID } from 'type-graphql';

@ObjectType()
export class User extends Typegoose {
    @Field(type => ID)
    _id: string;

    @IsString()
    @prop({ required: true })
    firebaseUid: string;

    @IsString()
    @prop( { required: true } )
    @Field()
    nome: string

    @IsString()
    @prop({ required: true })
    @Field()
    email: string;

    @IsString()
    @prop({ required: false })
    @Field()
    telefone: string;

    @IsString()
    @prop({ required: false })
    @Field()
    fotoUrl: string;

    @IsArray()
    @prop({ required: false })
    @Field(type => [String], { nullable: false })
    roles: string[];
}


@InputType()
export class UserInputRef extends Typegoose {
    @Field(type => ID)
    _id: string;
}

export class UserCreateFromFirebaseInput {    
    firebaseUid: string;
    nome: string
    email: string;
    fotoUrl: string;
    roles: string[];
}


