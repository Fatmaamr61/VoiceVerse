import authRouter from "./modules/auth/auth.router.js";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import session from "express-session";



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

  // Configure express-session middleware
  app.use(
    session({
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: true,
    })
  );
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
