import  Login  from "../modules/Auth/views/Login";
import Calendar from "../components/Calendar";
import Register from "../pages/Register";





export const PublicRoute = [
    {
        path: "/",
        element: <Login />
    },
    
    {
        path: "/register",
        element: <Register />
    }
    // {
    //     path: "/home",
    //     element: <Calendar />
    // },
]