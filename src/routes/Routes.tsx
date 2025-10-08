import { useContext } from "react";
import { PublicRoute } from "../routes/PublicRoutes";
import { AuthContext, Status } from "@/modules/Auth/context/AuthContext";
import { useRoutes } from "react-router-dom";
import { PrivateRoute } from "../routes/PrivateRoute";

export const Routes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const routes = useRoutes(
    isAuthenticated === Status.AUTHENTICATED ? PrivateRoute : PublicRoute,
  );

  return <>{routes}</>;
}


//  return <>{isAuthenticated === Status.CHECKING ? "LOADING" : routes}</>;
// }