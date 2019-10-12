import { Injectable, BadGatewayException } from '@nestjs/common';
import { User, UserCreateFromFirebaseInput, ClienteCreateInput, UserUpdateInput } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private readonly model: ModelType<User>) { }


    async findOrCreateFromFirebase(userFb : any) : Promise<User> {
        let user = await this.findByFirebaseUid(userFb.uid);
        
        if(user != null)
            return user;
           
            
        user = await this.findByEmail(userFb.email);
        
        if(user != null)
            return user;


        user = await this.create({
            firebaseUid: userFb.uid,
            nome: userFb.name,
            email: userFb.email,
            fotoUrl: userFb.picture,
            roles: ['user'] 
        });
        
        return user;
    }


    async findByFirebaseUid(uid: string): Promise<User> {
        const filter = {firebaseUid: uid};

        return await this.model.findOne(filter).lean();
    }

    async findByEmail(email: string ) : Promise<User> {
        const filter = {email};

        return await this.model.findOne(filter).lean();
    }

    async findById(id: string): Promise<User> {
        return await this.model.findById(id);
    }

    async findAll(): Promise<User> {
        return this.model
            .find()
            .sort({ nome: 'desc' })
            .lean();
    }

    async create(obj: UserCreateFromFirebaseInput | ClienteCreateInput): Promise<User> {
        const created = await this.model.create(obj);
        return this.findById(created._id);
    }

    async delete(id: string) {
        return await this.model.findByIdAndRemove(id);
    }
    

    async update(id: string, obj: UserUpdateInput) {
        return await this.model
            .findByIdAndUpdate(id, obj)
            .lean();
    }


}
