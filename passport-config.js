const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');

function init(passport, getUserByEmail, getUserById)
{
    const authenticator = async (email, password, done) =>
    {
        const user = await getUserByEmail(email);
        
        if (!user)
        {
            return done(null, false, {message: "This email address is not registered"})
        }

        try
        {
            if (await bcrypt.compare(password, user.password))
            {
                return done(null, user);
            }
            else
            {
                return done(null, false, {message: "Password is incorrect"});
            }
        }
        catch (err)
        {
            return done(err);
        }
    }
    
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticator))

    passport.serializeUser((user, done) =>
    {
        console.log("user from passport: ", user)
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) =>
    {
        const user = await getUserById(id);
        done(null, user);
    });
}

module.exports = init;