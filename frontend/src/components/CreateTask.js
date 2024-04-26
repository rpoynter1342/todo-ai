import React, { useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Fade } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
export const CreateTask = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [err, setError] = React.useState({});
  const [subtask1, setSubtask1] = React.useState("");
  const [subtask2, setSubtask2] = React.useState("");
  const [subtask3, setSubtask3] = React.useState("");
  const [subtasks, setSubtasks] = React.useState(false);
  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const handleCheckboxChange = (event) => {
    setIsCompleted(event.target.checked);
  };

  const handleGenerateSubtasks = () => {
    setRequestSent(true);
    fetch("http://localhost:5000/generate_subtasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSubtask1(data[0]);
        setSubtask2(data[1]);
        setSubtask3(data[2]);
        setSubtasks(data.length > 0);
        setRequestSent(false);
      })
      .catch((error) => {
        console.error("Error generating subtasks:", error);
        setRequestSent(false);
      });
  };

  const handleCreateTask = () => {
    setRequestSent(!requestSent);
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        completed: isCompleted,
        sub1: subtask1.content,
        sub2: subtask2.content,
        sub3: subtask3.content,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        addTask(data);
        console.log("Task created:", data);
        setTitle("");
        setDescription("");
        setSubtasks(false);
        setIsCompleted(false);

        setRequestSent(false);

        setOpen(true);

        setIsSuccess(true);
      })
      .catch((error) => {
        setRequestSent(false);
        console.error("Error creating task:", error);
        setOpen(true);
        setIsError(true);
        setError(error);
      });
  };
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "30vh", padding: "2%" }}
    >
      <Fade
        in={true}
        timeout={1500}
      >
        <Card sx={{ minHeight: "30vh", minWidth: "30vh", padding: "2%" }}>
          {!requestSent ? (
            <FormGroup>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <TextField
                    label="Title"
                    size="small"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    value={description}
                    label="Description"
                    size="small"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isCompleted}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Mark as complete"
                  />
                </Grid>
                {subtasks ? (
                  <>
                    <Grid item>
                      <TextField
                        value={subtask1.content}
                        label="Subtask 1"
                        size="small"
                        onChange={(e) => setSubtask1(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        value={subtask2.content}
                        label="Subtask 2"
                        size="small"
                        onChange={(e) => setSubtask2(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        value={subtask3.content}
                        label="Subtask 3"
                        size="small"
                        onChange={(e) => setSubtask3(e.target.value)}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AutoAwesomeIcon />}
                      onClick={handleGenerateSubtasks}
                    >
                      Generate Subtasks
                    </Button>
                  </Grid>
                )}

                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleCreateTask}
                  >
                    Create Task
                  </Button>
                </Grid>
              </Grid>
            </FormGroup>
          ) : (
            <Grid
              container
              direction="column"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          )}
        </Card>
      </Fade>
      {isSuccess ? (
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          message="Success"
          action={action}
        />
      ) : (
        <span></span>
      )}
      {isError ? (
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          message="Error"
          action={action}
        />
      ) : (
        <span></span>
      )}
    </Grid>
  );
};
