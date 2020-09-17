const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            trim: true,
            required: [true, 'First name is required.']
        },
        lastname: {
            type: String,
            trim: true,
            required: [true, 'Last name is required.']
        },
        profilePhotoUrl: {
            type: String,
            default: 'https://res.cloudinary.com/drewcloud06/image/upload/v1600378605/user-profile-computer-icons-avatar-clip-art-png-favpng-wKErPr4niCcNM5Hz3yf1n82Kg_kud13z.jpg'
        },
        followers: [{
            type: Schema.Types.ObjectId, ref :'User'
        }],
        following: [{
            type: Schema.Types.ObjectId, ref :'User'
        }],
        collections: [{
            type: Schema.Types.ObjectId, ref :'Collection'
        }],
        posts: [{
            type: Schema.Types.ObjectId, ref :'Post'
        }],
        username: {
            type: String,
            trim: true,
            required: [true, 'Username is required.'],
            unique: true    
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            unique: true,
            lowercase: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required.']
        },
        likes: [{
            type: Schema.Types.ObjectId, ref :'Post'
        }],
        isFollowing: {
            type: Boolean
        },
        numOfFollowers:{
            type: Number
        },
        numOfFollowing:{
            type: Number
        }
            
    },
    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);
