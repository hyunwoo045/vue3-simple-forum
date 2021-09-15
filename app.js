const express = require("express");
const app = express();

const whitelist = ["http://3.36.53.67", "http://127.0.0.1:8080"];
const corsOption = {
  origin: function (origin, callback) {
    var isWhiteListed = whitelist.indexOf(origin) !== 1;
    callback(null, isWhiteListed);
  },
  credentials: true,
};
const cors = require("cors")(corsOption);

const createError = require("http-errors");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const dbconfig = require("./key/config").database;
const sessionStore = new MySQLStore(dbconfig);
const sessionSecret = require("./key/config").session;
app.use(
  session({
    secret: sessionSecret.secret,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const googleClientConfig = require("./key/config").google;
const GOOGLE_CLIENT_ID = googleClientConfig.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = googleClientConfig.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = googleClientConfig.GOOGLE_CALLBACK_URL;
const kakaoClientConfig = require("./key/config").kakao;
const KAKAO_CLIENT_ID = kakaoClientConfig.KAKAO_CLIENT_ID;
const KAKAO_CALLBACK_URL = kakaoClientConfig.KAKAO_CALLBACK_URL;

const User = require("./models/user");
passport.serializeUser((user, done) => {
  console.log("SERIALIZED");
  done(null, {
    id: user.id,
    identifier: user.identifier,
    provider: user.provider,
    displayName: user.displayName,
  });
});
passport.deserializeUser((user, done) => {
  console.log("DESERIALIZED");
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, requestToken, profile, done) => {
      console.log("GOOGLE LOGIN!");
      try {
        let id = await User.find(profile.provider, profile.id);
        if (!id) {
          await User.create(profile.provider, profile.id, profile.displayName);
          id = await User.find(profile.provider, profile.id);
        }
        return done(null, {
          id,
          identifier: profile.id,
          provider: profile.provider,
          displayName: `G-${profile.displayName}`,
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
passport.use(
  new KakaoStrategy(
    {
      clientID: KAKAO_CLIENT_ID,
      callbackURL: KAKAO_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("KAKAO LOGIN!");
      try {
        let id = await User.find(profile.provider, profile.id);
        if (!id) {
          await User.create(profile.provider, profile.id, profile.displayName);
          id = await User.find(profile.provider, profile.id);
        }
        return done(null, {
          id,
          identifier: profile.id,
          provider: profile.provider,
          displayName: `Kakao-${profile.displayName}`,
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

const commentRouter = require("./routes/comment");
const contentRouter = require("./routes/content");
const authRouter = require("./routes/auth");
const authSocialRouter = require("./routes/auth_social");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/comment", commentRouter);
app.use("/api/content", contentRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth_social", authSocialRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
