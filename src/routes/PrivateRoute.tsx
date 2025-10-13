import Calendar from "../components/Calendar";
import Login from "../modules/Auth/views/Login";
import Register from "../pages/Register";
import Layout from "../layouts/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Notifications from "../pages/Notifications";
import ActasInspeccion from "../pages/ActasInspeccion";
import ActasComprobacion from "../pages/ActasComprobacion";
import Rubros from "../pages/Rubros";
import Comercios from "../pages/Comercios";
import Inspectores from "../pages/Inspectores";
import MapComponent from "../pages/MapComponent";
import Usuarios from "../pages/Usuarios";
import Header from "@/components/Header";

// import path from "path";
// import path from "path";
// import Rubros from "../pages/Rubros";
// import Comercios from "../pages/Comercios";



export const PrivateRoute = [

    // {path: "/login", element: <Login/>}, 


    {path: "/Register", element: (
        // <ProtectedRoute>
            <Register />
            // </ProtectedRoute>
    )
},

    { 
        element: <Layout/>,

        children: [
            {path: "/home" , element: <><Header/><Calendar/></>},

            
        {path: "/notifications", element: (
            <ProtectedRoute>
                <Notifications />
            </ProtectedRoute>
        )},
        {path: "/actas-inspeccion", element: (
            <ProtectedRoute>
                <ActasInspeccion />
            </ProtectedRoute>
        )},
        {path: "/actas-comprobacion", element: (
            <ProtectedRoute>
                <ActasComprobacion />
            </ProtectedRoute>
        )},
        {path: "/rubros", element: (
            <ProtectedRoute>
                <Rubros />
            </ProtectedRoute>
        )},   
        {path: "/comercios", element: (
            <ProtectedRoute>
                <Comercios />
            </ProtectedRoute>
        )}, 
        {path: "/inspectores", element: (
            <ProtectedRoute>
                <Inspectores />
            </ProtectedRoute>
        )}, 
        {path: "/mapa", element: (
            <ProtectedRoute>
                <MapComponent />
            </ProtectedRoute>
        )}, 
        {path: "/usuarios", element: (
            <ProtectedRoute>
               <Usuarios />
            </ProtectedRoute>
        )}, 
        ]
    },
]
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //     {
    //         path: "/notifications",   
    //         element: (
    //         //<ProtectedRoute>
    //             <Layout>
    //               <Notifications />
    //             </Layout>
    //             //</ProtectedRoute>
    //         )
    //     },
    
    //     {path: "/actas-inspeccion",
    //         element: (
    //         //<ProtectedRoute>
    //             <Layout>
    //               <ActasInspeccion />
    //             </Layout>
    //         //</ProtectedRoute>
    //         )
    //     },
    
    //     {
    //         path: "/actas-comprobacion",
    //         element: (
    //                //<ProtectedRoute>
    //             <Layout>
    //               <ActasComprobacion />
    //             </Layout>
    //             //</ProtectedRoute>
    //         )
    //     }
    // ]











