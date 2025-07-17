import "./parcel.css";
import React, { useEffect, useState } from "react";
import { GridToolbar, DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, Stack, buttonBaseClasses } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ConstructionOutlined, FileDownload, InsertPhoto, ReceiptLong } from "@mui/icons-material";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import ImageViewer from 'react-simple-image-viewer';

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
  borderRadius: ".5em",
};

export default function Parcel() {
  const [itemData, setItemData] = useState([]);
  const [userData, setUserData] = React.useState([]);
  const XLSX = require("sheetjs-style");
  const [isViewerOpen, setIsViewerOpen] = useState(false);


  const body = { test: "test" };
  const [openPhoto, setOpenPhoto] = React.useState(false);
  const handleOpen = (imgArr) => {
    

    setItemData(imgArr)
    setIsViewerOpen(true)

  }
  const handleClose = () => setOpenPhoto(false);
  const [dateBegin, setDateBegin] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [sheetData, setSheetData] = useState(null);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const filterParcelDate = () => {

    let selectedDate = new Date(dateFilter.$d).toLocaleString('en-us',{month:'numeric', day:'numeric' ,year:'numeric', timeZone: 'Asia/Manila'});

    console.log(selectedDate);
    getUser(selectedDate)
  };

  const handleCloseDialog = () => {
    setDateBegin(null);
    setDateEnd(null);
    setOpenDialog(false);
  };

  const handleCloseViewModal = () => {
    setOpenPhoto(false);
  };

  const columns = [
    { field: "count", headerName: "#", width: 80 },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "fullname",
      headerName: "Fullname",
      width: 250,
    },
    {
      field: "assigned_non_bulk",
      headerName: "Assigned NB",
      width: 200,
    },
    {
      field: "assigned_bulk",
      headerName: "Assigned B",
      width: 200,
    },
    {
      field: "total_assigned",
      headerName: "Total Assigned",
      width: 200,
      type: buttonBaseClasses,
    },
    {
      field: "delivered_non_bulk",
      headerName: "Delivered NB",
      width: 200,
      type: buttonBaseClasses,
    },
    {
      field: "delivered_bulk",
      headerName: "Delivered B",
      width: 200,
      type: buttonBaseClasses,
    },
    {
      field: "total_delivered_parcel",
      headerName: "Total Delivered",
      width: 200,
      type: buttonBaseClasses,
    },
    {
      field: "receipt",
      headerName: "Image",
      width: 200,
      type: buttonBaseClasses,
    },
    {
      field: "screenshot",
      headerName: "Image",
      width: 200,
      type: buttonBaseClasses,
    },
    {
      field: "img",
      headerName: "Photo",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const currentRow = params.row;
        const check = params.row.receipt;
        const viewReceipt = (e) => {
          
          const imgArr = currentRow.receipt
          
          handleOpen(imgArr);
    
        };

        const viewScreenshot = (e) => {
          const imgArr = [currentRow.screenshot]

          handleOpen(imgArr);
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
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => {
                  viewScreenshot();
                }}
              >
                <InsertPhoto/>
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
      field: "action",
      headerName: "Action",
      width: 160,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClick = (e) => {
          const currentRow = params.row;
          return alert(JSON.stringify(currentRow, null, 4));
        };

        return (
          <Stack>
            <Link
              to={"/view-parcel"}
              state={{ state: params.row.email }}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" color="warning" size="small">
                View More
              </Button>
            </Link>
          </Stack>
        );
      },
    },
  ];

  async function getUser(selectDate) {
    const passData = {
      selectDate: selectDate,
    };

    await axios
      .post("https://api-rma.bmphrc.com/retrieve-parcel-data", passData)
      .then(async (response) => {
        const data = await response.data.data;

        console.log("parcel sample", data)

        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            assigned_bulk: data.assigned_parcel_bulk_count,
            assigned_non_bulk: data.assigned_parcel_non_bulk_count,
            total_assigned: data.assigned_parcel_total,
            delivered_non_bulk: data.delivered_parcel_non_bulk_count ,
            delivered_bulk: data.delivered_parcel_bulk_count,
            total_delivered_parcel: data.delivered_parcel_total,
            email: data.email,
            fullname:
              data.first_name + " " + data.middle_name + " " + data.last_name,
            receipt : data.receipt,
            screenshot : data.screenshot
          };
        });
        console.log(newData, "testing par");
        setUserData(newData);
      });
  }

  function alertDialog(exportSuccess, message) {
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
      },
    });

    const ExportFailed = Swal.mixin({
      toast: true,
      position: "mid",
    });

    if (exportSuccess) {
      ExportSuccess.fire({
        icon: "success",
        title: message,
      });
      handleCloseDialog();
    } else {
      ExportFailed.fire({
        icon: "error",
        title: message,
      });
    }
  }

  const handleDlgClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      console.log("backdropClicked. Not closing dialog.");
      return;
    }

    handleCloseDialog();
  };

  async function getExportData() {
    console.log("date for now", dateBegin);
    if (dateBegin === null || dateEnd === null) {
      return alertDialog(false, "Please fill date fields");
    }

    let bDate = dateBegin.$d.getTime();

    let eDate = dateEnd.$d.getTime() + 86400000;

    const checkDate = eDate - bDate;

    if (checkDate <= 0)
      return alertDialog(
        false,
        "End date must be ahead or same day of start date"
      );

    console.log(bDate);

    const passData = {
      start: bDate,
      end: eDate,
    };

    await axios
      .post("https://api-rma.bmphrc.com/export-parcel-data", passData)
      .then(async (response) => {
        const data = await response.data.data;

        console.log(data);

        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            fullname: data.first_name + " " + data.last_name,
            email: data.email,
            date: data.date,
            bulk: data.count_bulk,
            non_bulk: data.count_non_bulk,
            total: data.count_total_parcel,
            assigned_parcel_count: data.assigned_parcel_count
            
          };
        });
        // console.log(newData, "testing par");
        setSheetData(newData);

        const wb = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(newData);

        ws["!cols"] = [
          { wch: 4 },
          { wch: 25 },
          { wch: 25 },
          { wch: 10 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
        ];

        XLSX.utils.sheet_add_aoa(
          ws,
          [["#", "Fullname", "Email", "Date", "Bulk", "Non-Bulk", "Total", "Assigned Parcel"]],
          { origin: "A1" }
        );

        ws["A1"].s = {
          // set the style for target cell
          font: {
            name: "#",
            sz: 10,
            bold: true,
            color: {
              rgb: "FFFFFFF",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
          fill: {
            patternType: "solid",
            bgColor: {
              rgb: "FFFFFFF",
            },
          },
        };
        ws["B1"].s = {
          // set the style for target cell
          font: {
            name: "#",
            sz: 10,
            bold: true,
            color: {
              rgb: "FFFFFFF",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
          fill: {
            patternType: "solid",
            bgColor: {
              rgb: "FFFFFFF",
            },
          },
        };
        ws["C1"].s = {
          // set the style for target cell
          font: {
            name: "#",
            sz: 10,
            bold: true,
            color: {
              rgb: "FFFFFFF",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
          fill: {
            patternType: "solid",
            bgColor: {
              rgb: "FFFFFFF",
            },
          },
        };
        ws["D1"].s = {
          // set the style for target cell
          font: {
            name: "#",
            sz: 10,
            bold: true,
            color: {
              rgb: "FFFFFFF",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
          fill: {
            patternType: "solid",
            bgColor: {
              rgb: "FFFFFFF",
            },
          },
        };
        ws["E1"].s = {
          // set the style for target cell
          font: {
            name: "#",
            sz: 10,
            bold: true,
            color: {
              rgb: "FFFFFFF",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
          fill: {
            patternType: "solid",
            bgColor: {
              rgb: "FFFFFFF",
            },
          },
        };
        ws["F1"].s = {
          // set the style for target cell
          font: {
            name: "#",
            sz: 10,
            bold: true,
            color: {
              rgb: "FFFFFFF",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
          fill: {
            patternType: "solid",
            bgColor: {
              rgb: "FFFFFFF",
            },
          },
        };
        ws["G1"].s = {
          // set the style for target cell
          font: {
            name: "#",
            sz: 10,
            bold: true,
            color: {
              rgb: "FFFFFFF",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
          fill: {
            patternType: "solid",
            bgColor: {
              rgb: "FFFFFFF",
            },
          },
        };

        ws["H1"].s = {
          // set the style for target cell
          font: {
            name: "#",
            sz: 10,
            bold: true,
            color: {
              rgb: "FFFFFFF",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
          fill: {
            patternType: "solid",
            bgColor: {
              rgb: "FFFFFFF",
            },
          },
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

  return (
    <div className="parcel">
      <Topbar />

      <div className="container">
        <Sidebar />

        {isViewerOpen && (
          <div className="img-viewer">
        <ImageViewer
          src={ itemData }
          currentIndex={0}
          disableScroll={ true }
          closeOnClickOutside={ true }
          onClose={ closeImageViewer }
        />
        </div>
      )}

        <div style={{ height: "100%", width: "100%", marginLeft: "100" }}>
          <div style={{ margin: 10 }}>
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
                  email: false,
                  screenshot: false,
                  receipt: false
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
            getRowId={(row) => row.count}
          />
        </div>

       

        {/* <Modal
          open={openPhoto}
          onClose={handleCloseViewModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={viewStyle}>
            <ImageList
              sx={{ width: 600, height: 550 }}
              cols={1}
              rowHeight={550}
            >
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    srcSet={`${item.img}?w=328&h=382&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=328&h=328&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>

            <DialogActions>
              <Button onClick={handleCloseViewModal}>Close</Button>
            </DialogActions>
          </Box>
        </Modal> */}

        <Dialog
          open={openDialog}
          onClose={handleDlgClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Export Data"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Start Date"
                  onChange={(newValue) => setDateBegin(newValue)}
                ></DatePicker>
                <div style={{ margin: 10 }}></div>
                <DatePicker
                  label="Select End Date"
                  onChange={(newValue) => setDateEnd(newValue)}
                ></DatePicker>
              </LocalizationProvider>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={getExportData}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

const viewStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
