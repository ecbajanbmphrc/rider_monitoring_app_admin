import { Link, NavLink } from "react-router-dom";
import "./sidebar.css";
import { Inventory, AssignmentInd, PeopleAlt, ManageAccounts, Warehouse, ExitToApp} from "@mui/icons-material";
import { styled } from "styled-components";
import * as React from 'react';
import { useLocation } from 'react-router-dom';



export default function Sidebar(){
    const location = useLocation();

    const[activeItem, setActiveItem] = React.useState(location.pathname);
   
    const handleItemClick = (itemName) =>  {
        setActiveItem(itemName);
   
    }

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    }
  
    
    return(
        
            <div className="sidebar">
           
              <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                    <NavLink to="/view-admin-accounts" style={{ textDecoration: 'none' }} onClick={() => handleItemClick("/view-accounts")}>
                     <li
                      className={`sidebarListItem ${
                      activeItem === "/view-admin-accounts" ? "active" : ""
                      }`}
                     >
                            <ManageAccounts className="sidebarIcon"/>
                            Admin Account
                        </li>
                    </NavLink>    
                    <NavLink to="/view-rider-accounts" style={{ textDecoration: 'none' }} onClick={() => handleItemClick("/view-accounts")}>
                     <li
                      className={`sidebarListItem ${
                      activeItem === "/view-rider-accounts" ? "active" : ""
                      }`}
                     >
                            <PeopleAlt className="sidebarIcon"/>
                            Rider Account
                        </li>
                     </NavLink>
                     <NavLink to="/" style={{ textDecoration: 'none' }} onClick={() => handleItemClick("/")}>
                        <li
                         className={`sidebarListItem ${
                         activeItem === "/" ? "active" : ""
                         }`}
                        >
                            <AssignmentInd className="sidebarIcon"/>
                            Attendance
                        </li>
                     </NavLink>
                     <NavLink to="/parcel" style={{ textDecoration: 'none' }} onClick={() => handleItemClick("/parcel")}>
                        <li
                         className={`sidebarListItem ${
                         activeItem === "/parcel" ? "active" : ""
                          }`}
                        >
                            <Inventory className="sidebarIcon"/>
                            Parcel
                        </li>
                     </NavLink>
                     <NavLink to="/hub" style={{ textDecoration: 'none' }} onClick={() => handleItemClick("/hub")}>
                        <li
                         className={`sidebarListItem ${
                         activeItem === "/hub" ? "active" : ""
                          }`}
                        >
                            <Warehouse className="sidebarIcon"/>
                            Hub
                        </li>
                     </NavLink>
                    
                        <li
                         className={`sidebarListItem`}
                         onClick={() => handleLogout()}
                        >
                            <ExitToApp className="sidebarIcon"/>
                            Logout
                        </li>
                 
                    </ul>
                </div>
              </div>
            </div>
    );
} 