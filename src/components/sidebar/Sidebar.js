import { Link, NavLink } from "react-router-dom";
import "./sidebar.css";
import { Inventory, AssignmentInd, ManageAccounts} from "@mui/icons-material";
import { styled } from "styled-components";
import * as React from 'react';
import { useLocation } from 'react-router-dom';



export default function Sidebar(){
    const location = useLocation();

    const[activeItem, setActiveItem] = React.useState(location.pathname);
   
    const handleItemClick = (itemName) =>  {
        setActiveItem(itemName);
        console.log(itemName)
    }
  
    
    return(
        
            <div className="sidebar">
                {console.log(location.pathname)}
              <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                    <NavLink to="/view-accounts" style={{ textDecoration: 'none' }} onClick={() => handleItemClick("/view-accounts")}>
                     <li
                      className={`sidebarListItem ${
                      activeItem === "/view-accounts" ? "active" : ""
                      }`}
                     >
                            <ManageAccounts className="sidebarIcon"/>
                            Accounts
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
                    </ul>
                </div>
              </div>
            </div>
    );
} 