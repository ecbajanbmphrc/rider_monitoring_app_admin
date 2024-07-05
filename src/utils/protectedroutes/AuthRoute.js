import { Outlet, Navigate, useLocation} from "react-router-dom";

const AuthRoute  = () => {
    const checkLoggedIn = localStorage.getItem('isLoggedIn');
    const location = useLocation();

   if (checkLoggedIn === ''){ 
    console.log("test")
    // <Outlet/> 
   }
   else{  
    // <Navigate to = "/"/>
   }
    return


}

export default AuthRoute