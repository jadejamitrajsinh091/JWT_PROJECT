import express from "express";
import dotenv from "dotenv";
import HttpError from "./middleware/httpError.js";
import connectDB from "./config/db.js";
import router from "./routes/user.route.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use("/user", router);

app.get("/", (req, res) => {
  res.json("hello from server");
});

app.use((req, res, next) => {
  return next(new HttpError("requested route not found", 404));
});

app.use((error, req, res, next) => {
  if (res.headersSent) 
  {
    return next(error);
  }

  res
    .status(error.statusCode || 500)
    .json({ message: error.message || "internal server error" });
});


const port = process.env.PORT;


async function startServer() 
{
  try 
  {
    const connect = await connectDB();

    if (!connect) 
    {
      return next(new HttpError("failed to connect db", 500));
    }

    app.listen(port, (err) => {
      if (err) 
      {
        return console.log(err.message);
      }

      console.log(`server is running on port ${port}`);

    });
  } 
  
  catch (error) 
  {
    console.log(error.message);
    process.exit(1);
  }
}

startServer();

