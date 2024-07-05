import "./App.css" 
import "./defaultApp.css"
import Attendance from './components/pages/attendance/Attendance';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Parcel from './components/pages/parcel/Parcel';
import ViewAttendance from './components/pages/attendance/ViewAttendance';
import Account from './components/pages/account/Account';
import ViewParcel from './components/pages/parcel/ViewParcel';
import Hub from './components/pages/hub/Hub';
import LogIn from './components/auth/login';
import Admin from './components/pages/admin/Admin'
import AdminRoute from "./utils/protectedroutes/AdminRoute";
import AuthRoute from "./utils/protectedroutes/AuthRoute";
import ForgotPassword from "./components/auth/forgotPassword";


function App() {
  
  return (
   
   
     
       
        <Routes>
          
          
          <Route element = {<AdminRoute/>}>   
            <Route path='/login' element={<LogIn/>} />
            <Route path='/forgot-password' element= {<ForgotPassword/>} />
            <Route path='/' element={<Attendance/>} />
            <Route path='/parcel' element={<Parcel/>} />
            <Route path='/view-parcel' element={<ViewParcel/>}/>
            <Route path='/view-attendance' element={<ViewAttendance/>} />
            <Route path='/view-rider-accounts' element={<Account/>} />
            <Route path='/view-admin-accounts' element={<Admin/>} />
            <Route path='/hub' element={<Hub/>} />
          </Route>
          
        </Routes>
   
  
  );
}

export default App;
