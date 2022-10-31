import {Schema, model, Document} from 'mongoose';

const ContactSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    contact_frequency:{
        type: String || null
    },
    notes:{
        type: String,
    },
    dob:{
        type: Date || null,
    },
    contact_date:{
        type: Date || null,
    }
}, {timestamps: true})

export interface IContact extends Document {
    parent: string;
    fullName: string;
    contact_frequency: string | null;
    notes: string;
    dob: Date | null;
    contact_date: Date | null;
}

export default model<IContact>('Contact', ContactSchema)