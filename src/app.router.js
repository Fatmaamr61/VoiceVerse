import authRouter from "./modules/auth/auth.router.js";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import cookieSession from "cookie-session";
import passport from "passport";

export const appRouter = (app, express) => {
  // morgan
  if (process.env.NODE_ENV == "dev") {
    app.use(morgan("dev"));
  }

  const corsOpts = {
    origin: "*",

    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type"],
  };

  app.use(cors(corsOpts));

  app.use(express.json());

  app.set("trust proxy", 1); // trust first proxy

  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  );

  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: process.env.COOKIE_KEYS,
    })
  );

  // intialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  //routes
  //auth
  app.use("/auth", authRouter);

  // not found page router
  app.all("*", (req, res, next) => {
    return next(new Error("page not found!", { cause: 404 }));
  });

  // global error handler
  app.use((error, req, res, next) => {
    const statusCode = error.cause || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  });
};
