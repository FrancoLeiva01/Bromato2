import  Login  from "../modules/Auth/views/Login";
import Register from "../pages/Register";
// import Calendar from "../components/Calendar";





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