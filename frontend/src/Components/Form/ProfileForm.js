import { useState, useEffect } from "react";
import { MuiTelInput } from "mui-tel-input";
import { useUpdateUserMutation } from "../../app/api/usersApiSlice";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import {
  EditNoteOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";

const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const NAME_REGEX = /^[A-z0-9\s]{3,36}$/;
const api_key = "989773282234796";
const cloud_name = "kebunv2";

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image);
  const [validName, setValidName] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [showPassword, setShowPassword] = useState(false);

  const [load, setLoad] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validImage, setValidImage] = useState(false);
  const [filename, setFilename] = useState("");
  const [pageRefresh, setPageRefresh] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [imageUrl, setImageUrl] = useState(user.image);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(
        "Image size exceeds 10MB. Please upload a smaller image."
      );
      setOpen(true);
      setImageUrl(URL.createObjectURL(file));
      setFilename(file.name);
      return;
    }
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
    setErrorMessage("");
    setFilename(file.name);
    setOpen(false);
  };
  useEffect(() => {
    if (pageRefresh) {
      window.location.reload();
    }
  }, [pageRefresh]);
  useEffect(() => {
    if (isError) {
      setCountdown(10);
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(countdownInterval);
        setPageRefresh(true);
      }, 11000);
    }
  }, [isError]);
  useEffect(() => {
    if (image) {
      const file = image;
      if (file.size <= 10 * 1024 * 1024) {
        setValidImage(true);
      } else {
        setValidImage(false);
      }
    }
  }, [image]);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setPassword("");

      setImage(null);
      setImageUrl("");
      setPhoneNumber("");
      navigate("/dashboard/");
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);

  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onPhoneNumberChanged = (value) => setPhoneNumber(value);

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    setLoad(true);
    const signatureResponse = await axios.get(
      "http://localhost:3500/get-signature"
    );
    if (password && image) {
      const data = new FormData();
      data.append("file", image);
      data.append("api_key", api_key);
      data.append("signature", signatureResponse.data.signature);
      data.append("timestamp", signatureResponse.data.timestamp);
      let imageHttps;
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: function (e) {
            const percentage = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentage);
          },
        }
      );
      const photoData = {
        public_id: cloudinaryResponse.data.public_id,
        version: cloudinaryResponse.data.version,
        signature: cloudinaryResponse.data.signature,
        secure_url: cloudinaryResponse.data.secure_url,
      };
      await axios
        .post("http://localhost:3500/do-something-with-photo", photoData)
        .then((response) => {
          imageHttps = response.data.imageHttps;
        })
        .catch((error) => {
          console.error(error);
        });
      await updateUser({
        id: user.id,
        name,
        username: user.username,
        phoneNumber,
        password,
        role: user.role,
        active: user.active,
        image: imageHttps,
      });
    } else if (password) {
      await updateUser({
        id: user.id,
        name,
        username: user.username,
        phoneNumber,
        password,
        role: user.role,
        active: user.active,
        image: user.image,
      });
    } else if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("api_key", api_key);
      data.append("signature", signatureResponse.data.signature);
      data.append("timestamp", signatureResponse.data.timestamp);
      let imageHttps;
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: function (e) {
            const percentage = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentage);
          },
        }
      );

      const photoData = {
        public_id: cloudinaryResponse.data.public_id,
        version: cloudinaryResponse.data.version,
        signature: cloudinaryResponse.data.signature,
        secure_url: cloudinaryResponse.data.secure_url,
      };
      await axios
        .post("http://localhost:3500/do-something-with-photo", photoData)
        .then((response) => {
          imageHttps = response.data.imageHttps;
        })
        .catch((error) => {
          console.error(error);
        });
      await updateUser({
        id: user.id,
        name,
        username: user.username,
        phoneNumber,

        role: user.role,
        active: user.active,
        image: imageHttps,
      });
    } else {
      await updateUser({
        id: user.id,
        name,
        username: user.username,
        phoneNumber,

        role: user.role,
        active: user.active,
        image: user.image,
      }).then((response) => {
        console.log(response);
      });
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  let canSave;
  if (password && image) {
    canSave =
      [validPassword, validName, validImage].every(Boolean) && !isLoading;
  } else if (password) {
    canSave = [validPassword, validName].every(Boolean) && !isLoading;
  } else if (image) {
    canSave = [validName, validImage].every(Boolean) && !isLoading;
  } else {
    canSave = [validName].every(Boolean) && !isLoading;
  }
  const errContent = error?.data?.message;

  const content = (
    <>
      <p>{errContent}</p>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "primary.main",
            }}
          >
            <EditNoteOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit Profile
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={onSaveUserClicked}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  type="text"
                  value={name}
                  onChange={onNameChanged}
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="off"
                  InputLabelProps={{ htmlFor: "name" }}
                />
              </Grid>
              <Grid item xs={12}>
                <MuiTelInput
                  type="text"
                  value={phoneNumber}
                  onChange={onPhoneNumberChanged}
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="off"
                  InputLabelProps={{ htmlFor: "phoneNumber" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  autoComplete="off"
                  value={password}
                  type={showPassword ? "text" : "password"}
                  onChange={onPasswordChanged}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ htmlFor: "password" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  htmlFor="image-upload"
                  onChange={handleImageChange}
                >
                  Pilih Gambar
                  <input
                    accept="image/*"
                    type="file"
                    id="image-upload"
                    hidden
                  />
                </Button>
                {filename && (
                  <Typography variant="body1">{filename}</Typography>
                )}
                {imageUrl && (
                  <div
                    style={{
                      marginLeft: "60px",
                      width: "70%",
                      height: "200px",
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: "100% 100%",
                      backgroundPosition: "center",
                    }}
                  />
                )}
              </Grid>
            </Grid>
            {load ? (
              <>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#eee",
                    "&.MuiLinearProgress-bar": {
                      backgroundColor: "#33b5e5",
                    },
                  }}
                />
                <Typography variant="caption" color="inherit">
                  {uploadProgress === 100
                    ? "Uploaded!"
                    : `Loading... ${uploadProgress}%`}
                </Typography>
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!canSave}
                >
                  Simpan Perubahan
                </Button>
              </>
            )}
            {(isError || open) && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {isError
                  ? `Data tidak valid. Page will be refreshed in ${countdown}`
                  : errorMessage}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
  return content;
};

export default EditUserForm;
