import mongoose from "mongoose";

function connect(dbUri: string) {
  return mongoose
    .connect(dbUri)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}

export default connect;