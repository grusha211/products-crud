const User = require('../models/userModel');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt= require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

class authController {
  static async login(req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          success: false,
          message: info ? info.message : 'Login failed',
        });
      }
      req.login(user, { session: false }, async (err) => {
        if (err) {
          res.send(err);
        }
        const payload = {
          email: user.email,
          id: user._id,
          role: user.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        user = user.toObject();
        user.token = token;
        user.password = undefined;
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
        res.cookie('token', token, options).status(200).json({
          success: true,
          token,
          user,
          message: 'Logged in Successfully✅',
        });
      });
    })(req, res, next);
  }

  static async signup(req, res) {
    const { email, password , role } = req.body;
    const isExisting = await User.findOne({ email });
    if (isExisting) {
      return res.send('Already existing');
    }
    // create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role
    });

    res.status(200).send({ message: 'successfully signed up!', newUser });
  }

  // static async verifyEmail(req, res) {
  //   const { email, otp } = req.body;
  //   const user = await User.findOne({ email });
  //   if (!user) {
  //     return res.status(404).json({ success: false, message: 'User not found' });
  //   }
  //   if (user && user.otp !== otp) {
  //     return res.status(400).json({ success: false, message: 'Invalid OTP' });
  //   }
  //   const updatedUser = await User.findByIdAndUpdate(user._id, { $set: { active: true } });
  //   res.status(200).json({ success: true, message: 'Email verified successfully', user: updatedUser });
  // }
}

// Configure Passport Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Password incorrect' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = authController;
