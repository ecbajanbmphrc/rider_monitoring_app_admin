import "./account.css";
import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import axios, { isAxiosError } from "axios";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDemoData } from "@mui/x-data-grid-generator";
import TextField from "@mui/material/TextField";
import { Warehouse } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Account() {
  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 4,
    maxColumns: 6,
  });

  const [userData, setUserData] = React.useState([]);

  const [openViewModal, setopenViewModal] = React.useState(false);
  const handleOpen = (z) => {
    if (z === 1) {
      setSelectViewModal(false);
    } else {
      setSelectViewModal(true);
    }
    setopenViewModal(true);
  };
  const handleClose = () => setopenViewModal(false);
  const [openHubDialog, setOpenHubDialog] = React.useState(false);
  const [updateHub, setUpdateHub] = React.useState("");
  const [updateHubId, setUpdateHubId] = React.useState("");
  const [selectViewModal, setSelectViewModal] = React.useState(true);
  const [arrayIndex, setArrayIndex] = React.useState("");

  const [updateStatus, setUpdateStatus] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");

  const requestBody = { isActivate: updateStatus, email: userEmail };

  const [modalFullName, setModalFullName] = React.useState("");
  const [modalRiderId, setModalRiderId] = React.useState("");
  const [modalFirstName, setModalFirstName] = React.useState("");
  const [modalMiddleName, setModalMiddleName] = React.useState("");
  const [modalLastName, setModalLastName] = React.useState("");
  const [modalAddress, setModalAddress] = React.useState("");
  const [modalEmail, setModalEmail] = React.useState("");
  const [modalPhone, setModalPhone] = React.useState("");
  const [modalJDate, setModalJDate] = React.useState("");
  const [modalHubName, setModalHubName] = React.useState("");
  const [modalHubId, setModalHubId] = React.useState("");
  const [hubList, setHubList] = React.useState([]);


  const [riderIdError, setRiderIdError] = React.useState("");
  const [firstNameError, setFirstNameError] = React.useState("");
  const [middleNameError, setMiddleNameError] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState("");
  const [addressError, setAddressError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [editRiderType, setEditRiderType] = React.useState("");

  const handleChangeRiderType = (event) => {
    setEditRiderType(event.target.value);
  };

  const handleRiderIdChange = (e) => {
    setModalRiderId(e.target.value);
    if (e.target.value.length < 2) {
      setRiderIdError("Please enter valid name");
    } else {
      setRiderIdError(false);
    }
  };

  const handleFirstNameChange = (e) => {
    setModalFirstName(e.target.value);
    if (e.target.value.length < 2) {
      setFirstNameError("Please enter valid name");
    } else {
      setFirstNameError(false);
    }
  };

  const handleMiddleNameChange = (e) => {
    setModalMiddleName(e.target.value);
    if (e.target.value.length < 2) {
      setMiddleNameError("Please enter valid name");
    } else {
      setMiddleNameError(false);
    }
  };

  const handleLastNameChange = (e) => {
    setModalLastName(e.target.value);
    if (e.target.value.length < 2) {
      setLastNameError("Please enter valid name");
    } else {
      setLastNameError(false);
    }
  };

  const handleAddressChange = (e) => {
    setModalAddress(e.target.value);
    if (e.target.value.length < 2) {
      setAddressError("Please enter valid name");
    } else {
      setAddressError(false);
    }
  };

  const handlePhoneChange = (e) => {
    if (e.target.value.length > 11) return;
    setModalPhone(e.target.value);
    if (e.target.value.length < 2) {
      setPhoneError("Please enter valid name");
    } else {
      setPhoneError(false);
    }
  };

  const handleSelectHub = (event) => {
    setUpdateHub(event.target.value || ""); 
  };

  const handleOpenHubDialog = () => {
    setOpenHubDialog(true);
  };

  const handleCloseHubDialog = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenHubDialog(false);
      setUpdateHub("");
    }
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    { field: "count", headerName: "#", width: 150 },
    { field: "rider_id", headerName: "ID", width: 200 },
    { field: "rider_type", headerName: "Type", width: 200 },
    { field: "first_name", headerName: "First name", width: 200 },
    { field: "middle_name", headerName: "Middle name", width: 200 },
    { field: "last_name", headerName: "Last name", width: 200 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phone",
      headerName: "Phone",
    },
    {
      field: "address",
      headerName: "Address",
    },
    {
      field: "date_join",
      headerName: "Date Join",
    },
    {
      field: "hub_name",
      headerName: "Hub Name",
    },
    {
      field: "hub_id",
      headerName: "Hub ID",
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const status = params.row.isActive;
        const rowEmail = params.row.email;
        const onClick = (e) => {
          {
            status ? setUpdateStatus(false) : setUpdateStatus(true);
          }
          setUserEmail(rowEmail);
          setArrayIndex(params.row.count - 1);
          handleOpenDialog();
        };

        return (
          <>
            {status ? (
              <Stack>
                <ColorButton
                  variant="contained"
                  size="small"
                  style={{ width: "50%", marginTop: "13px" }}
                  onClick={onClick}
                >
                  Active
                </ColorButton>
              </Stack>
            ) : (
              <Stack>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ width: "50%", marginTop: "13px" }}
                  onClick={onClick}
                >
                  Inactive
                </Button>
              </Stack>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClick = (e) => {
          let mFullname;
          let mRiderId = params.row.rider_id;
          let mRiderType = params.row.rider_type;
          let condition = params.row.middle_name;
          let mAddress = params.row.address;
          let mEmail = params.row.email;
          let mPhone = params.row.phone;
          let mJDate = params.row.date_join;
          let mHubName = params.row.hub_name;
          let mHubId = params.row.hub_id;
          if (condition === "Null") {
            mFullname = params.row.first_name + " " + params.row.last_name;
            condition = "";
          } else {
            mFullname =
              params.row.first_name +
              " " +
              params.row.middle_name +
              " " +
              params.row.last_name;
          }

          if (mRiderId === "Null") mRiderId = "";

          setArrayIndex(params.row.count - 1);
          setModalRiderId(mRiderId);
          setEditRiderType(mRiderType);
          setModalFullName(mFullname);
          setModalFirstName(params.row.first_name);
          setModalMiddleName(condition);
          setModalLastName(params.row.last_name);
          setModalAddress(mAddress);
          setModalEmail(mEmail);
          setModalPhone(mPhone);
          setModalJDate(mJDate);
          setModalHubId(mHubId);
          setModalHubName(mHubName);

          return handleOpen(e);
        };

        return (
          <Stack style={{ marginTop: 10 }} direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              color="info"
              onClick={() => onClick(0)}
            >
              <VisibilityIcon></VisibilityIcon>
            </Button>
            <Button
              variant="contained"
              size="small"
              color="info"
              onClick={() => onClick(1)}
            >
              <EditIcon></EditIcon>
            </Button>
          </Stack>
        );
      },
    },
  ];

  async function getUser() {
    await axios
      .post("http://54.255.154.99:8082/get-rider-user", requestBody)
      .then(async (response) => {
        const data = await response.data.data;

        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            rider_id: data.rider_id ? data.rider_id : "Null",
            rider_type: data.rider_type ? data.rider_type : "Null",
            first_name: data.first_name,
            middle_name: data.middle_name ? data.middle_name : "Null",
            last_name: data.last_name,
            email: data.email,
            address: data.address,
            phone: data.phone,
            date_join: data.j_date
              ? new Date(data.j_date).toLocaleDateString("en-us", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Null",
            isActive: data.isActivate,
            hub_id: data.hub_id,
            hub_name: data.hub_name[0] ? data.hub_name[0] : "no data",
          };
        });
        console.log(newData, "testing par");
        setUserData(newData);
      });
  }

  async function getHubList() {
    await axios
      .post("http://54.255.154.99:8082/fetch-hub", requestBody)
      .then(async (response) => {
        const data = await response.data.data;

        console.log(data);
        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            id: data._id,
            hub_name: data.hub_name,
          };
        });

        setHubList(newData);
        setUpdateHub(modalHubId);

        handleOpenHubDialog();
      });
  }

  async function setStatus() {
    console.log("check body", requestBody);
    await axios
      .put("http://54.255.154.99:8082/update-status", requestBody)
      .then(async (response) => {
        const data = await response.data.status;

        if (data === 200) {
          userData[arrayIndex].isActive = requestBody.isActivate;
          Swal.fire({
            title: "Success",
            text: "Status Updated Successfully!",
            icon: "success",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            handleCloseDialog();
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Error on updating status!",
            icon: "error",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            handleCloseDialog();
          });
        }
      });
  }

  async function updateUserHub() {
    await axios
      .put("http://54.255.154.99:8082/update-user-hub", {
        hub_id: updateHub,
        email: modalEmail,
      })
      .then(async (response) => {
        const data = await response.data.status;

        if (data === 200) {
          const result = hubList.find(({ id }) => id === updateHub);

          userData[arrayIndex].hub_id = result.hub_id;
          userData[arrayIndex].hub_name = result.hub_name;

          setModalHubId(result.id);
          setModalHubName(result.hub_name);
          handleCloseHubDialog();

          Swal.fire({
            title: "Success",
            text: "User Hub Updated Successfully!",
            icon: "success",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            handleCloseDialog();
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Error on updating status!",
            icon: "error",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            handleCloseDialog();
          });
        }
      });
  }

  async function updateUserDetails() {
    await axios
      .put("http://54.255.154.99:8082/update-user-detail-admin", {
        rider_id: modalRiderId,
        first_name: modalFirstName,
        middle_name: modalMiddleName,
        last_name: modalLastName,
        address: modalAddress,
        phone: modalPhone,
        email: modalEmail,
        rider_type: editRiderType,
      })
      .then(async (response) => {
        const data = await response.data.status;
        if (data === 200) {
          // const result = hubList.find(({ id }) => id === updateHub);

          userData[arrayIndex].rider_id = modalRiderId ? modalRiderId : "Null";
          userData[arrayIndex].rider_type = editRiderType ? editRiderType : "Null";
          userData[arrayIndex].first_name = modalFirstName;
          userData[arrayIndex].middle_name = modalMiddleName
            ? modalMiddleName
            : "Null";
          userData[arrayIndex].last_name = modalLastName;
          userData[arrayIndex].address = modalAddress;
          userData[arrayIndex].phone = modalPhone;

          Swal.fire({
            title: "Success",
            text: "User details updated successfully!",
            icon: "success",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            handleClose();
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Error on updating user details!",
            icon: "error",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            handleClose();
          });
        }
      });
  }

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="account">
      <Topbar />
      <div className="container">
        <Sidebar />
        <div style={{ height: "100%", width: "100%", marginLeft: "100" }}>
          <DataGrid
            rows={userData}
            sx={{ overflowX: "scroll" }}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              columns: {
                columnVisibilityModel: {
                  address: false,
                  phone: false,
                  date_join: false,
                  hub_name: false,
                  hub_id: false,
                  email: false,
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
            getRowId={(row) => row.count}
          />
        </div>

        <Modal
          open={openViewModal}
          onClose={handleCloseDialog}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Stack spacing={3}>
              <p>Full Details :</p>
              <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Rider ID"
                id="outlined-read-only-input"
                defaultValue={modalRiderId}
                onChange={handleRiderIdChange}
                InputProps={{
                  readOnly: selectViewModal,
                }}
              />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Rider Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Rider Type"
                  value = {editRiderType}
                  onChange={handleChangeRiderType}
                >
                  <MenuItem value={"Null"}>None</MenuItem>
                  <MenuItem value={"2WH"}>2 Wheel</MenuItem>
                  <MenuItem value={"3WH"}>3 Wheel</MenuItem>
                  <MenuItem value={"4WH"}>4 Wheel</MenuItem>
                  <MenuItem value={"Mobile Hub"}>Mobile hub</MenuItem>
                  <MenuItem value={"Walker"}>Walker</MenuItem>
                  <MenuItem value={"Flexi"}>Flexi</MenuItem>
                </Select>
              </FormControl>
              {selectViewModal && (
                <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                <TextField
                  label="Fullname"
                  id="outlined-read-only-input"
                  defaultValue={modalFullName}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                </FormControl>
              )}

              {!selectViewModal && (
                <>
                  <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                  <TextField
                    label="First Name"
                    id="outlined-read-only-input"
                    defaultValue={modalFirstName}
                    onChange={handleFirstNameChange}
                    InputProps={{
                      readOnly: selectViewModal,
                    }}
                  />
                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                  <TextField
                    label="Middle Name"
                    id="outlined-read-only-input"
                    defaultValue={modalMiddleName}
                    onChange={handleMiddleNameChange}
                    InputProps={{
                      readOnly: selectViewModal,
                    }}
                  />
                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                  <TextField
                    label="Last Name"
                    id="outlined-read-only-input"
                    defaultValue={modalLastName}
                    onChange={handleLastNameChange}
                    InputProps={{
                      readOnly: selectViewModal,
                    }}
                  />
                  </FormControl>
                </>
              )}
               <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Address"
                id="outlined-read-only-input"
                defaultValue={modalAddress}
                onChange={handleAddressChange}
                InputProps={{
                  readOnly: selectViewModal,
                }}
              />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Email"
                id="outlined-read-only-input"
                defaultValue={modalEmail}
                InputProps={{
                  readOnly: true,
                }}
              />
              </FormControl>
                 <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Phone"
                id="outlined-read-only-input"
                defaultValue={modalPhone}
                onChange={handlePhoneChange}
                InputProps={{
                  readOnly: selectViewModal,
                }}
              />
              </FormControl>
                 <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Hub"
                id="outlined-read-only-input"
                // defaultValue={modalHubName}
                value={modalHubName}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <>
                      {!selectViewModal && (
                        <Button variant="contained" onClick={getHubList}>
                          <Warehouse />
                        </Button>
                      )}
                    </>
                  ),
                }}
              />
              </FormControl>
              {selectViewModal && (
                <TextField
                  label="Date Joined"
                  id="outlined-read-only-input"
                  defaultValue={modalJDate}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              )}
              {/* <TextField
                label="Hub"
                id="outlined-read-only-input"
                defaultValue={modalhub}
                InputProps={{
                    readOnly: true,
                }}
              /> */}
            </Stack>
            {/* </Typography> */}
            <Stack>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>

                {!selectViewModal && (
                  <Button onClick={updateUserDetails}>Save</Button>
                )}
              </DialogActions>
            </Stack>
          </Box>
        </Modal>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Account Activation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {updateStatus
                ? "Are you sure you want to set this user as active?"
                : "Are you sure you want to set this user as inactive?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={setStatus} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          disableEscapeKeyDown
          open={openHubDialog}
          onClose={handleCloseHubDialog}
        >
          <DialogTitle>Select Hub</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Hub</InputLabel>
                <Select
                  value={updateHub}
                  onChange={handleSelectHub}
                  input={<OutlinedInput label="Hub" />}
                >
                  {hubList.map((hub) => (
                    <MenuItem value={hub.id} key={hub.id}>
                      {hub.hub_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseHubDialog}>Cancel</Button>
            <Button onClick={updateUserHub}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#000",
  backgroundColor: "#F6FAB9",
  "&:hover": {
    backgroundColor: "#CAE6B2",
  },
}));
