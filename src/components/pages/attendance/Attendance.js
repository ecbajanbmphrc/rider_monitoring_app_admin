import "./attendance.css"
import React, {useEffect, useState} from "react";
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import axios from "axios";
import { FileDownload,  ReceiptLong} from "@mui/icons-material";
import RoomIcon from '@mui/icons-material/Room';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Alert from '@mui/material/Alert';
import Swal from "sweetalert2";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import DescriptionIcon from '@mui/icons-material/Description';
import ImageViewer from 'react-simple-image-viewer';

    
  

export default function Attendance(){

    const [userData, setUserData] = useState([]);  

  
    const XLSX = require('sheetjs-style');

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
    const [dateFilter, setDateFilter] = useState(null);
    const [isProofViewerOpen, setIsProofViewerOpen] = useState(false);
    const [isReceiptProofViewerOpen, setIsReceiptProofViewerOpen] = useState(false);
    const [proofItemData, setProofItemData] = useState([]);
    const [proofItemReceiptData, setProofItemReceiptData] = useState([]);

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = () => {
      setOpenDialog(true);
    };

    const handleOpenProof = (imgArr) => {
      
      setProofItemData(imgArr)
      setIsProofViewerOpen(true)
      console.log("proof", isProofViewerOpen)
  
    }

    const handleOpenReceiptProof = (imgArr) => {
    
      setProofItemReceiptData(imgArr)
      setIsReceiptProofViewerOpen(true)
  
    }

    const closeImageViewer = () => {
      setIsProofViewerOpen(false);

      
    };

    const closeImageProofViewer = () => {
    
      setIsReceiptProofViewerOpen(false)
      
    };

    const filterParcelDate = () => {

      let selectedDate = new Date(dateFilter.$d).toLocaleString('en-us',{month:'numeric', day:'numeric' ,year:'numeric', timeZone: 'Asia/Manila'});
  
      console.log(selectedDate);
      getUser(selectedDate)
    };
  
    const handleCloseDialog = () => {
      setDateBegin(null)
      setDateEnd(null)
      setOpenDialog(false);
    };


    const columns = [
      { field: 'count', headerName: '#', width: 100 },
      {
        field: 'email',
        headerName: 'Email',
        width: 250,filterParcelDate
      },
      {
        field: 'fullname',
        headerName: 'Fullname',
        width: 250,
      },
      { field: 'time_in', headerName: 'Time In', width: 110},
      { field: 'time_in_loc', 
      headerName: '', 
      width: 120,
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
          const check = params.row.time_in;
          return (
            <>
           {check === "no record" ? 

            <Stack style={{marginBottom:100,alignItems:'center'}}>
                    -
            </Stack>

           :

            <Stack style={{marginTop:10, alignItems:'center'}}>
            
              <Button variant="contained" color="warning" size="small" onClick={() => {onClick();  }}><RoomIcon></RoomIcon></Button>
          
            </Stack>
          

          }
          </>
          );
        }
      },
      { field: 'time_in_coordinates', headerName: 'Time In Location', width: 175 },
      {
        field: "proof_img",
        headerName: "Proof",
        width: 120,
        sortable: false,
        disableClickEventBubbling: true,
  
        renderCell: (params) => {
 
          const currentRow = params.row;
          const check = params.row.proof;
         
          const viewProofImg = (e) => {
            const imgArr = [currentRow.proof]
            
            handleOpenProof(imgArr);
          };
  
        
          return (
        
            <>
            {check !== "no record" ? (
              <Stack style={{ marginTop: 10, alignItems: 'center' }}
               direction="row"
               spacing={1}>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => {
                    viewProofImg();
                  }}
                >
                  <DescriptionIcon/>
                </Button>
              </Stack>
            ) : (
              <Stack style={{ marginBottom: 100, alignItems: 'center' }}>-</Stack>
            )}
          </>
          );
        },
      },  
      { field: 'time_out_coordinates', headerName: 'Time out Location', width: 175 },
      { field: 'proof', headerName: 'Proof', width: 175 },
      { field: 'time_out', headerName: 'Time Out', width: 110 },
      {
        field: "receipt",
        headerName: "Image",
        width: 200,
      },
      {
        field: "img",
        headerName: "Proof",
        width: 180,
        sortable: false,
        disableClickEventBubbling: true,
  
        renderCell: (params) => {
          const currentRow = params.row;
          const check = params.row.receipt;
          const viewReceipt = (e) => {
            
            const imgArr = currentRow.receipt            
            handleOpenReceiptProof(imgArr);

      
          };
  
        
          return (
        
            <>
            {check !== "no record" ? (
              <Stack style={{ marginTop: 10 }}
               direction="row"
               spacing={1}>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => {
                    viewReceipt();
                  }}
                >
                  <ReceiptLong/>
                </Button>
          
  
              </Stack>
            ) : (
              <Stack style={{ marginBottom: 100 }}>no record</Stack>
            )}
          </>
          );
        },
      },
      {
        field: 'time_out_loc',
        headerName: '',
        width: 120  ,
        sortable: false,
        disableClickEventBubbling: true,
      
        renderCell: (params) => {
          const onClick = async (e) => {
            const currentRow = params.row;

            const userLatitude = await currentRow.time_out_coordinates.latitude;
            const userLongitude = await currentRow.time_out_coordinates.longitude;
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${userLatitude}&lon=${userLongitude}`;
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

            <Stack style={{marginTop:10, alignItems:'center'}}>
            
              <Button variant="contained" color="warning" size="small" onClick={() => {onClick() }}><RoomIcon></RoomIcon></Button>
          
           </Stack>
           :
           <Stack style={{marginBottom:100,alignItems:'center'}}>
            -
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

    function alertDialog (exportSuccess, message){


      
      const ExportSuccess = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });

      const ExportFailed = Swal.mixin({
        toast: true,
        position: "mid",
      });

      if(exportSuccess){
     
        ExportSuccess.fire({
          icon: "success",
          title: message
        })
        handleCloseDialog();
      }else{

        ExportFailed.fire({
          icon: "error",
          title: message
        })
      }

   

    
  
    }


    const handleDlgClose = (event, reason) => {
      if (reason && reason === "backdropClick") {
        console.log('backdropClicked. Not closing dialog.')
        return;
      }

      handleCloseDialog()
    }


   
   

    async function handleOnExport() {




      const bDate = dateBegin.$d;

      const eDate = dateEnd.$d;


      const newBDate = bDate.getTime();



    };

    async function getUser(selectDate){
      const passData = {
        selectDate: selectDate,
      };

      await  
        axios
        .post('https://rider-monitoring-app-backend.onrender.com/retrieve-user-attendance-today', passData)
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
               proof: data.proof,
               email: data.email,
               receipt: data.parcel,
               fullname: data.first_name + " " + data.middle_name + " " + data.last_name
              
            };
           }
          );
       
          setUserData(newData);


        });

    }


    async function getExportData(){
     
      console.log("date for now" , dateBegin)
      if(dateBegin === null || dateEnd === null) {return alertDialog(false, "Please fill date fields")}

    
      let bDate = dateBegin.$d.getTime();

      let eDate = (dateEnd.$d.getTime()) + 86400000;

      const checkDate = eDate - bDate;

      if(checkDate <= 0) return alertDialog(false, "End date must be ahead or same day of start date")

   
      console.log(bDate);
      
      const passData = {
        start : bDate,
        end : eDate
      } 

      console.log(passData);
      await  axios
        .post('https://rider-monitoring-app-backend.onrender.com/export-attendance-data', passData)
        .then(async response=> {
          const data = await response.data.data;

          console.log(data)

          const newData = data.map((data, key) => {
            
            return {
               count : key + 1,
               fullname: data.first_name + " " + data.last_name,
               email: data.email,
               date : data.date,
               proof : data.assigned_parcel_screenshot,
               time_in: data.timeIn,
               time_out: data.timeOut? data.timeOut: "no record",
              
              
            };
           }
          );
          // console.log(newData, "testing par");
          setSheetData(newData);
    
          const wb = XLSX.utils.book_new();

          const ws = XLSX.utils.json_to_sheet(newData);

          const max_width = newData.reduce((wb, r) => Math.max(wb, r.email.length), 10);

          

          ws["!cols"] = [{wch: 4}, {wch: 30},{wch: 30} , {wch: 10} , {wch: 15} , {wch: 15}];

          XLSX.utils.sheet_add_aoa(ws, [["#", "Fullname","Email" , "Date", "Time In", "Time Out"]], { origin: "A1" });
          

          ws["A1"].s = { // set the style for target cell
            font: {
              name: '#',
              sz: 10,
              bold: true,
              color: {
                rgb: "FFFFFFF"
              },
            },
            alignment:{
              vertical : "center",
              horizontal: "center"
            },
            fill: {
              patternType: "solid",
              bgColor: {
                rgb: "FFFFFFF" 
              },
            }
          };
          ws["B1"].s = { // set the style for target cell
            font: {
              name: '#',
              sz: 10,
              bold: true,
              color: {
                rgb: "FFFFFFF"
              },
            },
            alignment:{
              vertical : "center",
              horizontal: "center"
            },
            fill: {
              patternType: "solid",
              bgColor: {
                rgb: "FFFFFFF" 
              },
            }
          };
          ws["C1"].s = { // set the style for target cell
            font: {
              name: '#',
              sz: 10,
              bold: true,
              color: {
                rgb: "FFFFFFF"
              },
            },
            alignment:{
              vertical : "center",
              horizontal: "center"
            },
            fill: {
              patternType: "solid",
              bgColor: {
                rgb: "FFFFFFF" 
              },
            }
          };
          ws["D1"].s = { // set the style for target cell
            font: {
              name: '#',
              sz: 10,
              bold: true,
              color: {
                rgb: "FFFFFFF"
              },
            },
            alignment:{
              vertical : "center",
              horizontal: "center"
            },
            fill: {
              patternType: "solid",
              bgColor: {
                rgb: "FFFFFFF" 
              },
            }
          };
          ws["E1"].s = { // set the style for target cell
            font: {
              name: '#',
              sz: 10,
              bold: true,
              color: {
                rgb: "FFFFFFF"
              },
            },
            alignment:{
              vertical : "center",
              horizontal: "center"
            },
            fill: {
              patternType: "solid",
              bgColor: {
                rgb: "FFFFFFF" 
              },
            }
          };
          ws["F1"].s = { // set the style for target cell
            font: {
              name: '#',
              sz: 10,
              bold: true,
              color: {
                rgb: "FFFFFFF"
              },
            },
            alignment:{
              vertical : "center",
              horizontal: "center"
            },
            fill: {
              patternType: "solid",
              bgColor: {
                rgb: "FFFFFFF" 
              },
            }
          };
         
    
          XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    
          XLSX.writeFile(wb, "MyExcel.xlsx");

          
        
          alertDialog(true, "Data exported successfully");
        
          // return

        });

    }

    
    React.useEffect(() => {
      const dateToday = new Date().toLocaleString('en-us',{month:'numeric', day:'numeric' ,year:'numeric', timeZone: 'Asia/Manila'});
      getUser(dateToday);
      
    }, []);


    return(

        <div className="attendance">
          <Topbar/>
          <div className="container">
          <Sidebar/>

          {isProofViewerOpen && (
          <div className="img-viewer">
        <ImageViewer
          src={ proofItemData }
          currentIndex={0}
          disableScroll={ true }
          closeOnClickOutside={ true }
          onClose={ closeImageViewer }
        />
        </div>
      )}

      {isReceiptProofViewerOpen && (
          <div className="img-viewer">
        <ImageViewer
          src={ proofItemReceiptData }
          currentIndex={0}
          disableScroll={ true }
          closeOnClickOutside={ true }
          onClose={ closeImageProofViewer }
        />
        </div>
      )}
          
              
        <div style={{ height:'100%',  width : '100%', marginLeft: '100'}}>
        <div style={{margin: 10}}>
        <Stack 
            direction={{ xs: 'column', md: 'row',sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}>      

            <div class="MuiStack-root">

            <Button
                onClick={handleOpenDialog}
                variant="contained"
                endIcon={<FileDownload />}
              >
                Export
              </Button>

            </div>

            <div class="MuiStack-root">

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  onChange={(newValue) => setDateFilter(newValue)}
                  slotProps={{ textField: { size: 'small' } }}
                ></DatePicker>
              
              </LocalizationProvider>

              <Button
                onClick={filterParcelDate}
                variant="contained"
                style={{marginLeft: 5}}
              >
                Go
              </Button>

            </div>
             
          
              
            </Stack>
        </div>
        
        <DataGrid
          rows={userData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            columns: {
              columnVisibilityModel: {
                time_in_coordinates: false,
                time_out_coordinates: false,
                email:false,
                proof:false,
                receipt:false,
                time_in_loc: false,
                time_out_loc: false
               
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
            },
          }}
          loading={!userData.length}  
          disableDen
          sitySelector
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          disableVirtualization
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
            <MapContainer center={[latitude, longitude]} zoom={17} scrollWheelZoom={false}  style={{ height: '100%', minHeight: '100%' }}>
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
        onClose={handleDlgClose}
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