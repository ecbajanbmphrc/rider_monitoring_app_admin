import "./parcel.css"
import React, {useEffect, useState} from 'react';
import {GridToolbar,  DataGrid} from '@mui/x-data-grid';
import axios from "axios";
import { Button, Stack, buttonBaseClasses } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FileDownload} from "@mui/icons-material";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";



  const style = {
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    // width: 400,
    // bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    // p: 4,
    
    position: "absolute",
    backgroundColor: "#FFF",
    padding: "15px",
    zIndex: "1000",
    width: "35%",
    borderRadius: ".5em"
  };

  
  

    
  

export default function Parcel(){

    const [userData, setUserData] = React.useState([]);  
    const XLSX = require('sheetjs-style');

    const body = {test: "test"};
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);  
    const [dateBegin, setDateBegin] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [sheetData, setSheetData] = useState(null);

    const [openDialog, setOpenDialog] = React.useState(false);


    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setDateBegin(null)
      setDateEnd(null)
      setOpenDialog(false);
    };

    const columns = [
      { field: 'count', headerName: '#', width: 80 },
      {
        field: 'email',
        headerName: 'Email',
        width: 250,
      },
      {
        field: 'fullname',
        headerName: 'Fullname',
        width: 250,
      },
      {
        field: 'bulk',
        headerName: 'Bulk',
        width: 200,
      },
      {
        field: 'non_bulk',
        headerName: 'Non-Bulk',
        width: 200,
      },
      {
        field: 'total_parcel',
        headerName: 'Total',
        width: 200,
        type: buttonBaseClasses
      },
      {
        field: 'total_assigned',
        headerName: 'Assigned Parcel',
        width: 200,
        type: buttonBaseClasses
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 180,
        sortable: false,
        disableClickEventBubbling: true,
        
        renderCell: (params) => {
            const onClick = (e) => {
              const currentRow = params.row;
              return alert(JSON.stringify(currentRow, null, 4));
            };
            
            return (
            <Stack>
                <Link to={"/view-parcel"}
                  state={{ state : params.row.email }}
                  style={{textDecoration:"none"}}
            >
                <Button variant="contained" color="warning" size="small" >View More</Button>
                </Link>
            </Stack>
            );
        },
      }
    ];



    async function getUser(){
      await  axios
        .post('https://rider-monitoring-app-backend.onrender.com/retrieve-parcel-data')
        .then(async response=> {
          const data = await response.data.data;
          

          const newData = data.map((data, key) => {
            return {

               count : key + 1,
               bulk : data.count_bulk,
               non_bulk : data.count_non_bulk,
               total_parcel : data.count_non_bulk + data.count_bulk, 
               email: data.user,
               fullname: data.first_name + " " + data.middle_name + " " + data.last_name,
               total_assigned: data.assigned_parcel
            };
           }
          );
          console.log(newData, "testing par");
          setUserData(newData);


        });

    }

    function alertDialog (exportSuccess, message){

      // Swal.fire({
      //   title: "Good job!",
      //   text: "You clicked the button!",
      //   icon: "success"
      // });

      
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
        .post('https://rider-monitoring-app-backend.onrender.com/export-parcel-data', passData)
        .then(async response=> {
          const data = await response.data.data;

          console.log(data)

          const newData = data.map((data, key) => {
            
            return {
               count : key + 1,
               fullname: data.first_name + " " + data.last_name,
               email: data.email,
               date : data._id,
               bulk: data.count_bulk,
               non_bulk: data.count_non_bulk,
               total: data.count_bulk + data.count_non_bulk
            };
           }
          );
          // console.log(newData, "testing par");
          setSheetData(newData);
    
          const wb = XLSX.utils.book_new();

          const ws = XLSX.utils.json_to_sheet(newData);

         

          

          ws["!cols"] = [{wch: 4}, {wch: 25} , {wch: 25} , {wch: 10} , {wch: 15} , {wch: 15} , {wch: 15}];

          XLSX.utils.sheet_add_aoa(ws, [["#", "Fullname" ,"Email" , "Date", "Bulk", "Non-Bulk" , "Total"]], { origin: "A1" });
          

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
          ws["G1"].s = { // set the style for target cell
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
        getUser();
      
    }, []);



    return(
        
        <div className="parcel">
          <Topbar/>
        
          <div className="container">
          <Sidebar/>
      
  
        <div style={{ height: '100%', width : '100%', marginLeft: '100'}}>
        <div style={{margin: 10}}>
          <Button onClick={handleOpenDialog} variant="contained" endIcon={<FileDownload/>}>Export</Button>
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
                email:false
               
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
          disableDensitySelector
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
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
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
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

