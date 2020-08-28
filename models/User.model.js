const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: [true, 'Username is required.']
        },
        lastName: {
            type: String,
            trim: true,
            required: [true, 'Username is required.']
        },
        profilePhotoUrl: {
            type: String,
            default: 'https://www.pikpng.com/pngvi/bJoxRi_default-avatar-svg-png-icon-free-download-264157-user-avatar-icon-png/'
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
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);
