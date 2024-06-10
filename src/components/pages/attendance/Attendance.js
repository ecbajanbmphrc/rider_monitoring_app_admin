import "./attendance.css"
import React, {useEffect, useState} from "react";
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import axios from "axios";
import { Inventory, AssignmentInd, AlignHorizontalCenter} from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker, Popup } from "react-leaflet"
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import XLSX from "xlsx";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

    
  

export default function Attendance(){

  const [userData, setUserData] = useState([]);  

    const body = {test: "test"};
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);  
    const [latitude , setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [city, setCity] = useState();
    const [street, setStreet] = useState();
    const [sheetData, setSheetData] = useState(null);
    const [dateBegin, setDateBegin] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };


    const columns = [
      { field: 'count', headerName: '#', width: 100 },
      {
        field: 'email',
        headerName: 'Email',
        width: 250,
      },
      { field: 'time_in', headerName: 'Time In', width: 175},
      { field: 'time_in_loc', 
      headerName: 'Time In Location', 
      width: 175,
      sortable: false,
      disableClickEventBubbling: true,
      
      renderCell: (params) => {
          const onClick = async (e) => {
            const currentRow = params.row;

            const userLatitude = await currentRow.time_in_coordinates.latitude;
            const userLongitude = await currentRow.time_in_coordinates.longitude;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`;
            fetch(url)
            .then( res => res.json())
            .then(data=>{
              console.log(data)
              setCity(data.address.city)
              setStreet(data.address.road)
              setLatitude(userLatitude);
              setLongitude(userLongitude);
              handleOpen()
            }
              )

            return
          };
          const check = params.row.time_out;
          return (
            <>
           {check === "no record" ? 

           "no record"

           :

            <Stack style={{marginTop:10}}>
            
              <Button variant="contained" color="warning" size="small" onClick={() => {onClick();  }}>View</Button>
          
            </Stack>
          

          }
          </>
          );
        }
      },
      { field: 'time_in_coordinates', headerName: 'Time In Location', width: 175 },
      { field: 'time_out_coordinates', headerName: 'Time out Location', width: 175 },
      { field: 'time_out', headerName: 'Time Out', width: 175 },
      {
        field: 'time_out_loc',
        headerName: 'Time out Location',
        width: 175  ,
        sortable: false,
        disableClickEventBubbling: true,
      
        renderCell: (params) => {
          const onClick = async (e) => {
            const currentRow = params.row;

            const userLatitude = await currentRow.time_out_coordinates.latitude;
            const userLongitude = await currentRow.time_out_coordinates.longitude;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`;
            fetch(url)
            .then( res => res.json())
            .then(data=>{
              console.log(data)
              setCity(data.address.city)
              setStreet(data.address.road)
              setLatitude(userLatitude);
              setLongitude(userLongitude);
              handleOpen()
            }
              )

            return
          };
          const check = params.row.time_out;
          return (
            <>
            {check !== "no record" ? 

            <Stack style={{marginTop:10}}>
            
              <Button variant="contained" color="warning" size="small" onClick={() => {onClick() }}>View</Button>
          
           </Stack>
           :
           <Stack style={{marginBottom:100}}>
            no record
           </Stack>

            }
          </>
          );
      },
    },
    {
      field: 'action',
      headerName: 'History',
      width: 175,
      sortable: false,
      disableClickEventBubbling: true,
      
      renderCell: (params) => {
          const onClick = (e) => {
            const currentRow = params.row;
            return alert(JSON.stringify(currentRow, null, 4));
          };
          
          return (
         
           <Stack>
              <Link to={"/view-attendance"}
                state={{ state : params.row.email }}
                style={{textDecoration:"none"}}
              >
              <Button variant="contained" color="warning" size="small" >Select</Button>
              </Link>
           </Stack>
         
          );
      }
    },

    ];

    async function handleOnExport() {


      // let bDate = dateBegin.$d.toLocaleString('en-us', {month: 'numeric', day: 'numeric', year:'numeric'});

      const bDate = dateBegin.$d;

      const eDate = dateEnd.$d;


      const newBDate = bDate.getTime();

      // var wb = XLSX.utils.book_new(),
      // ws = XLSX.utils.json_to_sheet(sheetData);

      // XLSX.utils.book_append_sheet(wb, ws, "MySheet1");

      // XLSX.writeFile(wb, "MyExcel.xlsx");

      console.log(bDate, "test date");
      console.log(eDate, "test date");

    };

    async function getUser(){
      await  axios
        .post('http://192.168.50.139:8082/retrieve-user-attendance-today', body)
        .then(async response=> {
          const data = await response.data.data;

          console.log(data)

          const newData = data.map((data, key) => {
            
            return {
               count : key + 1,
               time_in: data.timeIn,
               time_out: data.timeOut? data.timeOut: "no record",
               time_in_coordinates: data.timeInCoordinates,
               time_out_coordinates: data.timeOutCoordinates,
               email: data.user
              
            };
           }
          );
          console.log(newData, "testing par");
          setUserData(newData);


        });

    }


    async function getExportData(){

      let bDate = dateBegin.$d.getTime();

      let eDate = dateEnd.$d.getTime();

      console.log(bDate);
      
      const passData = {
        start : bDate,
        end : eDate
      } 
      await  axios
        .post('http://192.168.50.139:8082/test-index', passData)
        .then(async response=> {
          const data = await response.data.data;

          console.log(data)

          const newData = data.map((data, key) => {
            
            return {
               count : key + 1,
               email: data.user,
               date : data.attendance.date,
               time_in: data.attendance.time_in,
               time_out: data.attendance.time_out? data.attendance.time_out: "no record",
              
              
            };
           }
          );
          // console.log(newData, "testing par");
          setSheetData(newData);
    
          var wb = XLSX.utils.book_new(),
          ws = XLSX.utils.json_to_sheet(newData);
    
          XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    
          XLSX.writeFile(wb, "MyExcel.xlsx");


          return

        });

    }

    
    React.useEffect(() => {
        getUser();
      
    }, []);


    return(

        <div className="attendance">
          <div>
          <div style={{margin: 10}}>
            <Button onClick={handleOpenDialog} variant="contained">Export</Button>
          </div>
              
        <div style={{ height:'100%',  width : '100%', marginLeft: '100'}}>
         
        
        <DataGrid
          rows={userData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                time_in_coordinates: false,
                time_out_coordinates: false   
               
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
            
              showQuickFilter: true,
            },
          }}
          loading={!userData.length}  
          disableDen
          sitySelector
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          pageSizeOptions={[5, 10]}
          getRowId={(row) =>  row.count}

        />
        </div>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          <Box sx={style}>

   
         
           <div className="leaflet-container">
            <MapContainer center={[latitude, longitude]} zoom={17} scrollWheelZoom={false}  style={{ height: "100%", minHeight: '100%' }}>
            <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
            <Popup>
            {city}, <br /> {street}
            </Popup>
            </Marker>
           </MapContainer>

          </div>
             
         </Box>
        </Modal>


        <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Export Data"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Select Start Date"
            onChange={(newValue) => setDateBegin(newValue)}>
            </DatePicker>
            <div style={{margin:10}}></div>
            <DatePicker label="Select End Date"
            onChange={(newValue) => setDateEnd(newValue)}>  
            </DatePicker>
          </LocalizationProvider>
            
         
          
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick= {handleCloseDialog}>Cancel</Button>
          <Button onClick={getExportData}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


        </div>
      </div>
          
    );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};