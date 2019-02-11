const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// Nodmailer Transporter
// let transporter = nodemailer.createTransport({
//   host: 'localhost',
//   port: 1025,
//   ignoreTLS: true
// });

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'lazoneenpersonne75@gmail.com',
    pass: 'nkpmbkpqthfnxiew' 
  }
});

// LOGIN ROUTE
router.get("/login", (req, res, next) => {
  let data = {
    layout: false
  }
  res.render("auth/login", { "message": req.flash("error") , layout:false});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


// SIGNUP ROUTE
router.get("/signup", (req, res, next) => {
  let data = {
    layout: false
  }
  res.render("auth/signup", data);
});

router.post("/signup", (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const company = req.body.company;
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);


    const email = req.body.email;
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)]; // CONFIRMATION CODE CREATED
    }


    const newUser = new User({
      firstName,
      lastName,
      company,
      email,
      password: hashPass,
      confirmationCode: token
    });


    const confirmationUrl = `http://localhost:3000/confirm/${token}`

    newUser.save()

      .then(() => {

        // SENDING CONFIRMATION MAIL
        transporter.sendMail({
          from: 'Zone <lazoneenpersonne75@gmail.com>',
          to: email,
          subject: 'Zone te parle',
          text: 'Zone',
          html: `Sisi La Zone. Confirme ton lourd mail : <a href="${confirmationUrl}">Cliquer ici<a>`
        })

        console.log('confirmation email sent', email)

        res.redirect("/login"); // il faudrait renvoyer vers une page "confirme ton mail"
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});


router.get("/confirm/:confirmationCode", (req, res, next) => {
  User.findOne({confirmationCode: req.params.confirmationCode }, (err, user) => {
    if (user) {
      res.render("auth/confirmation", { user: user });
    console.log("email is verified");
  } else {
    console.log("email is not verified");
    res.end("Bad Request");
  }
  });
});



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
