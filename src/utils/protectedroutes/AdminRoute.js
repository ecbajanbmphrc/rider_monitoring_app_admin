import { Outlet, Navigate, useLocation} from "react-router-dom";



const AdminRoute = () => {
    const checkLoggedIn = localStorage.getItem('isLoggedIn');
    const location = useLocation();
    const path = location.pathname;
 
        switch(path){
            case '/login':
                if(checkLoggedIn === null){
               
                    return <Outlet/>
                }else{
                    return <Navigate to = "/"/>
                }
            case '/forgot-password':
                if(checkLoggedIn === null){
                    return <Outlet/>
                }else{
                    return <Navigate to = "/"/>
                }    
            case '/':
                if(checkLoggedIn === null){
                    return <Navigate to = "/login"/>
                }else{
                    return <Outlet/>
                }
            case '/dashboard':
                if(checkLoggedIn === null){
                    return <Navigate to = "/login"/>
                }else{
                    return <Outlet/>
                }    
            
            case '/parcel':
                if(checkLoggedIn === null){
                    console.log("login route end", checkLoggedIn, path)
                    return <Navigate to = "/login"/>
                }else{
                    console.log("login route dis", checkLoggedIn, path)
                    return <Outlet/>
                }
            case '/view-parcel':
                if(checkLoggedIn === null){
                    console.log("login route end", checkLoggedIn, path)
                    return <Navigate to = "/login"/>
                }else{
                    console.log("login route dis", checkLoggedIn, path)
                    return <Outlet/>
                }
            case '/view-attendance':
                if(checkLoggedIn === null){
                    console.log("login route end", checkLoggedIn, path)
                    return <Navigate to = "/login"/>
                }else{
                    console.log("login route dis", checkLoggedIn, path)
                    return <Outlet/>
                }  
                
            case '/view-admin-accounts':
                if(checkLoggedIn === null){
                    console.log("login route end", checkLoggedIn, path)
                    return <Navigate to = "/login"/>  
                }else{
                    console.log("login route dis", checkLoggedIn, path)
                    return <Outlet/>
                    }    
            case '/view-rider-accounts':
                if(checkLoggedIn === null){
                    console.log("login route end", checkLoggedIn, path)
                    return <Navigate to = "/login"/>  
                }else{
                    console.log("login route dis", checkLoggedIn, path)
                    return <Outlet/>
                }
            case '/hub':
                if(checkLoggedIn === null){
                    console.log("login route end", checkLoggedIn, path)
                    return <Navigate to = "/login"/>  
                    
                }else{
                    console.log("login route dis", checkLoggedIn, path)
                    return <Outlet/>
                }    
            default:
                if(checkLoggedIn === ""){
                    console.log("login route")
                    return <Navigate to = "/login"/>
                }else{
                    console.log("islogged in true", location)
                    return <Navigate to = "/"/>   
                }  
             
            }
 
        //  checkLoggedIn ? <Outlet/> : <Navigate to = "/login"/>

      }

export default AdminRoute