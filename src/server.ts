import App from "@/app";
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import UsersRoute from "@routes/users.route";
import validateEnv from "@utils/validateEnv";
import BannersRoute from "./routes/banner.route";
import LocationRoute from "./routes/bus.route";
import MusicRoute from "./routes/music.route";
import PushRoute from "./routes/push.route";
import WebRoute from "./routes/web.route";
import SchoolRoute from "./routes/school.route";

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new MusicRoute(),
  new PushRoute(),
  new BannersRoute(),
  new WebRoute(),
  new LocationRoute(),
  new SchoolRoute(),
]);

app.listen();
