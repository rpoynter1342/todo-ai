import * as React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Fade } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
export default function TaskList(props) {
  console.log(props);
  const [checked, setChecked] = React.useState([0]);
  const [taskInfo, setTaskInfo] = React.useState(null);

  const handleToggle = (task) => {
    // Toggle the completion status of the task
    const updatedCompletedStatus = !task.completed;

    // Send a PUT request to update the completion status in the backend
    fetch(`http://localhost:5000/update_task_completion/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: updatedCompletedStatus }),
    })
      .then((response) => {
        if (response.ok) {
          task.completed = updatedCompletedStatus; // Update the local state
          setChecked(
            checked.includes(task.id)
              ? checked.filter((id) => id !== task.id)
              : [...checked, task.id]
          );
        } else {
          console.error("Failed to update task completion");
        }
      })
      .catch((error) =>
        console.error("Error updating task completion:", error)
      );
  };

  const handleInfo = (taskId) => {
    fetch(`http://localhost:5000/task_info/${taskId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setTaskInfo(data);
      })
      .catch((error) => console.error("Error fetching task info:", error));
  };

  const handleClose = () => {
    setTaskInfo(null);
  };

  const handleDelete = (taskId) => {
    fetch(`http://localhost:5000/delete_task/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          props.onTaskDelete(taskId);
        } else {
          console.error("Failed to delete task");
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handleSaveChanges = () => {
    fetch(`http://localhost:5000/update_task/${taskInfo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskInfo),
    })
      .then((response) => {
        if (response.ok) {
          props.onTaskUpdate(taskInfo);
          setTaskInfo(null);
        } else {
          console.error("Failed to update task");
        }
      })
      .catch((error) => console.error("Error updating task:", error));
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
        <Card
          sx={{
            minHeight: "30vh",
            minWidth: "30vh",
            maxHeight: "30vh",
            padding: "2%",
          }}
        >
          {props.props.length == 0 ? (
            <div>You have no tasks.</div>
          ) : (
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                overflow: "auto",
                maxHeight: "30vh",
              }}
            >
              {props.props.map((value) => {
                const labelId = `checkbox-list-label-${value.id}`;

                return (
                  <ListItem
                    key={value}
                    secondaryAction={
                      <ListItemSecondaryAction sx={{ display: "flex" }}>
                        <IconButton
                          aria-label="info"
                          onClick={() => handleInfo(value.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(value.id)}
                          edge="end"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    }
                    disablePadding
                  >
                    <ListItemButton dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={value.completed}
                          onChange={() => handleToggle(value)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={value.title}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Card>
      </Fade>
      {taskInfo && (
        <Dialog
          open={true}
          onClose={handleClose}
        >
          <DialogTitle>
            Edit Task
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Title"
                  value={taskInfo.title}
                  onChange={(e) =>
                    setTaskInfo({ ...taskInfo, title: e.target.value })
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={taskInfo.description}
                  onChange={(e) =>
                    setTaskInfo({ ...taskInfo, description: e.target.value })
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Subtask 1"
                  value={taskInfo.sub1}
                  onChange={(e) =>
                    setTaskInfo({ ...taskInfo, sub1: e.target.value })
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Subtask 2"
                  value={taskInfo.sub2}
                  onChange={(e) =>
                    setTaskInfo({ ...taskInfo, sub2: e.target.value })
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Subtask 3"
                  value={taskInfo.sub3}
                  onChange={(e) =>
                    setTaskInfo({ ...taskInfo, sub3: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleSaveChanges}
            >
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  );
}
