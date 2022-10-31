import {Schema, model, Document} from 'mongoose';

const UserSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    dob:{
        type: Date,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    verified:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    contacts: [{
        type: Schema.Types.ObjectId,
    }],
    timezone: {
        type: String,
        required: true,
    },
    last_daily_mail: {
        type: Date,
    },
    todo: [{
        date: Date,
        task: [String]
    }]
}, {timestamps: true})

export interface IUser extends Document {
    id: string;
    fullName: string;
    email: string;
    password: string;
    verified: boolean;
    avatar: string;
    role: 'user' | 'admin';
    dob: Date;
    contacts: string[];
    last_daily_mail: Date;
    timezone: string;
    todo: {
        date: Date;
        task: string[];
    }[]
}

export default model<IUser>('User', UserSchema)