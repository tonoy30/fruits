import { model, Schema } from 'mongoose';

interface IUser {
	name: string;
	email: string;
	avatar?: string;
}
const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		avatar: String,
	},
	{ timestamps: true }
);

export const User = model<IUser>('Users', userSchema);
