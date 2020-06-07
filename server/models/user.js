import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

let User = mongoose.model('User', userSchema);

/**
 * Creates user.
 */
User.createUser = (user) =>
{
    bcrypt.genSalt(10, function(err, salt) 
    {
        bcrypt.hash(user.password, salt, function(err, hash) 
        {
            if(err) throw err;
            user.password = hash;
            return user.save();
        });
    });
};

export default User;