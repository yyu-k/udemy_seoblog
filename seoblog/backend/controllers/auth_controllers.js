const User = require('../models/user_model'); //the mongoose schema for User
const Blog = require('../models/blog_model')
const  { nanoid } = require('nanoid');
const { logger } = require('../backend_logger')
const jwt = require('jsonwebtoken');
const {expressjwt} = require('express-jwt');
const {generateDBErrorMsg} = require('../helpers/generateDBErrorMsg');
const {sendEmailWithNodemailer} = require('../helpers/email');
const bcrypt = require("bcrypt");
const { CONSTANTS } = require('../CONSTANTS');

exports.preSignup = (req, res) => {
    const {name, email, password} = req.body;
    const user = User.findOne({email : email.toLowerCase()})
        .then(user => {
            if (user) {
                res.status(400).json({
                    error : 'Email is taken. If you have forgotten your password, please reset it instead'
                });
            }
            return user
        })
        .catch(err => {
            res.status(400).json({
                error : generateDBErrorMsg(err)
            });
            return 1;
        })
    user.then(async user => {
        if (user) {
            return;
        } else {
            hashedPassword = await bcrypt.hash(password, CONSTANTS.bcrypt_salt_rounds);
            const token = jwt.sign(
                {name, email, hashedPassword}, 
                process.env.JWT_ACC_ACTIVATION_SECRET, 
                {expiresIn: '30m'}
                );
            //Prepare email with reset link
            const emailData = {
                from: process.env.OUTLOOK_EMAIL,
                to: email,
                subject: "Account Activation Link",
                html: `
                    <p>Please use the following link to activate your account:</p>
                    <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
                    <p>This link expires in 30 minutes.</p>
                    <hr />
                    <p>This email is sent as part of a web dev tutorial - please ignore</p>
                `
                };
            sendEmailWithNodemailer(req, res, emailData, `Activation email has been sent to ${email}`)
        }
    })
}

exports.signup_token_checker = (req, res, next) => {
    //Note: nextWithError works because any arguement passed to next() means that the middleware encountered an error 
    //https://expressjs.com/en/guide/error-handling.html
    const nextWithError = (err) => {
        if (err) {
          logger.error(err);
          let errorMsg;
          switch(err.inner.name) {
            case 'TokenExpiredError':
                errorMsg = 'Token expired - please try signing up again';
                break;
            default:
                errorMsg = err.message;
            }   
          return (res.status(err.status).json({
            error: errorMsg
          }))
        }
        next();
      }
    // Authenticate as usual
    return expressjwt({
        secret: process.env.JWT_ACC_ACTIVATION_SECRET,
        algorithms: ["HS256"],
        getToken: function (req) {
            return req.body.token
        }
    })(req, res, nextWithError)
}

exports.signup = (req, res) => {
    const {name, email, hashedPassword} = req.auth;
    const user = User.findOne({email : email.toLowerCase()})
        .then(user => {
            if (user) {
                res.status(400).json({
                    error : `Account with the email ${email} has already been activated`
                });
            }
            return user
        })
        .catch(err => {
            res.status(400).json({
                error : generateDBErrorMsg(err)
            });
            return 1;
        })
    user.then(user => {
        if (user) {
            return 
        } else {
            const username = nanoid();
            const profile = `${process.env.CLIENT_URL}/profile/${username}` //url for user
            const new_user = new User({username, profile, email, name, hashed_password : hashedPassword}); //ordering doesn't matter
            new_user
                .save()
                .then((success) => {
                    res.json({
                        success : true,
                        message : "Sign up success! Please sign in"
                    })
                })
                .catch((err) => {
                    return res.status(400).json({ //bad request
                        error: generateDBErrorMsg(err) //edited from just err
                    })
                })                
        }
    });
}

// old signup function deployed when there is no activation email and user signs up directly
// exports.signup = (req, res) => {
//     const {name, email, password} = req.body;
//     //check if user email already exists
//     User.findOne({email : email})
//         .exec()
//         .then(async (result) => { 
//             if (result){//user already exists, reject
//                 return res.status(400).json({
//                     error: 'Email is taken'
//                 })
//             } else {
//                 const username = nanoid();
//                 const profile = `${process.env.CLIENT_URL}/profile/${username}` //url for user
//                 const new_user = User({username, profile, email, name}) //ordering doesn't matter
//                 await new_user.setPassword(password);
//                 new_user
//                     .save()
//                     .then((success) => {
//                         res.json({
//                             message : "Sign up success! Please sign in"
//                             //user : success //for debugging
//                         })
//                     })
//                     .catch((err) => {
//                         return res.status(400).json({ //bad request
//                             error: generateDBErrorMsg(err) //edited from just err
//                         })
//                     })                
//                 }
//         })
//         .catch((err) => {
//             return res.status(400).json({ //bad request
//                 error: err.message
//             })
//         })
// }

exports.signin = (req, res) => {
    const {email, password} = req.body;
    //check if user email exists
    User.findOne({email}) //shortcut of {email : email}
        .exec()
        .then(async (user) => { 
            if (!user){//user doesn't exists, reject
                return res.status(400).json({
                    error: 'Authentication failure'
                });
            }
            const authResult = await user.authenticate(password);
            if (!authResult) {
                return res.status(400).json({
                    error: 'Authentication failure'
                })
            //authentication succeeds, give jwt
            } else {
                //create jwt token
                const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
                //respond with a cookie containing the jwt token
                res.cookie('token', token, {expiresIn: '1d'});
                return res.json({
                    token,
                    user : {id : user._id, username : user.username, name : user.name, email : user.email, role : user.role}
                })
            }
        })
        .catch((err) => {
            logger.error(err);
            return res.status(400).json({ //bad request
                error: "Error encountered, please try again"
            })
        })
}

exports.signout = (req, res) => {
    res.clearCookie("token", {
        expiresIn: '1d'
    })
    return res.json({
        message : "Signout success - cookie cleared"
    })
}

//this is middleware, placed between the routes and the actual processing logic in the routes file
exports.require_sign_in = (req, res, next) => {
    //Note: nextWithError works because any arguement passed to next() means that the middleware encountered an error 
    //https://expressjs.com/en/guide/error-handling.html
    const nextWithError = (err) => {
        if (err) {
          return (res.status(err.status).json({
            error: err.message
          }))
        }
        next();
      }
    // Authenticate as usual
    return expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: ["HS256"]
    })(req, res, nextWithError)
}

//middleware to check if user exists/who the user is before redirecting
//essentailyl makes the user available in req.profile
exports.authMiddleware = (req, res, next) => { //middleware requires next
    const authUserId = req.auth._id;
    User.findById({_id: authUserId}).exec()
    .then((user) => {
        if (user) {
            req.profile = user;
            next();
        } else {
            return res.status(400).json({
                error: 'user not found'
            });
        }
    })
    .catch((err) => {
        return res.status(400).json({
            error: 'Error encountered while trying to find user by the relevant _id'
        })
    })
}

//middleware to check if user.role === 1 before allowing the user to proceeed down the specified route
exports.adminMiddleware = (req, res, next) => { //middleware requires next
    const adminUserId = req.auth._id;
    User.findById({_id: adminUserId}).exec()
    .then((user) => {
        if (user && user.role === 1) {
            req.profile = user;
            next();
        } else if (!user) {
            return res.status(400).json({
                error: 'user not found'
            });
        } else {
            return res.status(400).json({
                error: 'Admin resource - access denied'
            })
        }
    })
    .catch((err) => {
        return res.status(400).json({
            error: 'Error encountered while trying to find user by the relevant _id'
        })
    })
}

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .exec()
    .then((blog) => {
        const authorizedUser = blog.postedBy._id.toString() === req.auth._id.toString(); //need to apply the require_sign_in middleware to get this
        if (!authorizedUser) {
            return res.status(400).json({
                error : 'Authorization error'
            })
        } else {
            next();
        }
    })
    .catch(err => {
        return res.status(400).json({
            error : generateDBErrorMsg(err)
        });
    })
}

exports.forgotPassword = (req, res) => {
    const {email} = req.body;
    User.findOne({email})
    .exec()
    .then((user) => {
        if (!user) {
            return res.status(401).json({
                error : 'User with the email does not exist'
            })
        } else {
            const token = jwt.sign({
                _id : user._id,
            }, process.env.JWT_RESET_SECRET,
            {expiresIn: '10m'});
            //Prepare email with reset link
            const emailData = {
                from: process.env.OUTLOOK_EMAIL,
                to: email,
                subject: "Password Reset Link",
                html: `
                    <p>Please use the following link to reset your password:</p>
                    <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                    <p>This link expires in 10 minutes.</p>
                    <hr />
                    <p>This email is sent as part of a web dev tutorial - please ignore</p>
                `,
              };
            //update user with reset password link
            user.updateOne({reset_password_link : token})
            .exec()
            .then(user => {
                return sendEmailWithNodemailer(req, res, emailData)
            })
            .catch(err => {
                return res.status(400).json({
                    error : generateDBErrorMsg(err)
                })
            })
            
            
        }
    })
    .catch(err => {
        return res.status(400).json({
            error : generateDBErrorMsg(err)
        });
    })
}

exports.resetPasswordMiddleware = (req, res, next) => {
    //Note: nextWithError works because any arguement passed to next() means that the middleware encountered an error 
    //https://expressjs.com/en/guide/error-handling.html
    const nextWithError = (err) => {
        if (err) {
          return (res.status(err.status).json({
            error: err.message
          }))
        }
        next();
      }
    // Authenticate as usual
    return expressjwt({
        secret: process.env.JWT_RESET_SECRET,
        algorithms: ["HS256"],
        getToken: function (req) {
            return req.body.resetPasswordLink
        },
        onExpired: function(req, err) {
            err.message = 'Link has expired, please try resetting again';
            throw err; 
        }
    })(req, res, nextWithError)
}

exports.resetPassword = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body;
    User
    .findOne({reset_password_link : resetPasswordLink})
    .then(async user => {
        if (!user) {
            return res.status(404).json({
                error : 'User not found'
            })
        } else {
            user.reset_password_link = '';
            await user.setPassword(newPassword);
            user
            .save()
            .then(user => {
                res.json({
                    message: "Password reset succeeded"
                })
            })
            .catch(err => {
                return res.status(400).json({
                    error : generateDBErrorMsg(err)
                });
            })
        }
    })
    .catch(err => {
        return res.status(400).json({
            error : generateDBErrorMsg(err)
        });
    })
}