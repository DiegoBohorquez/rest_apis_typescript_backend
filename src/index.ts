import colors from "colors";
import server from "./server";

if (process.env.NODE_ENV !== "production") {
  process.loadEnvFile();
}
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(colors.cyan.bold(`REST API en el puerto ${port}`));
});
