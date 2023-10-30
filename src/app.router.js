import authRouter from "./modules/auth/auth.router.js";
import morgan from "morgan";
import cors from "cors";

export const appRouter = (app, express) => {
  // morgan
  if (process.env.NODE_ENV == "dev") {
    app.use(morgan("dev"));
  }

  const corsOpts = {
     origin: "*",

     methods: ["GET", "POST"],

     allowedHeaders: ["Content-Type"],
  };

  app.use(cors(corsOpts));

  app.use(express.json());

  //routes
  //auth
  app.use("/auth", authRouter);

  // CORS
  // const whitelist = ["http://*:3007", "http://0.0.0.0:3000"]
  // app.use((req, res, next) => {
  //   console.log(req.header);
  //   if (req.originalUrl.includes("/auth/confirmEmail")) {
  //     res.setHeader("Access-Control-Allow-Origin", "*");
  //     res.setHeader("Access-Control-Allow-Methods", "*");
  //     return next();
  //   }
  //  /*  if (!whitelist.includes(req.header("origin"))) {
  //     return next(new Error("Blocked by CORS!"));
  //   } */
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Headers", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "*");
  //   res.setHeader("Access-Control-Allow-Private-Network", true);
  //   return next();
  // });

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
