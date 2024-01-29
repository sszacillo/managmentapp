import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

axios.defaults.withCredentials = true;

const ProjectDetails = () => {
  const { id } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [comments, setComments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newMeetingName, setNewMeetingName] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [statusOptions] = useState(["Do zrobienia", "W trakcie", "Wykonane"]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("Do zrobienia");
  const [newTaskStartDate, setNewTaskStartDate] = useState("");
  const [newTaskEndDate, setNewTaskEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingsResponse = await axios.get(
          `http://127.0.0.1:8000/projects/${id}/meetings`
        );
        setMeetings(meetingsResponse.data);

        const commentsResponse = await axios.get(
          `http://127.0.0.1:8000/projects/${id}/comments`
        );
        setComments(commentsResponse.data);

        const tasksResponse = await axios.get(
          `http://127.0.0.1:8000/projects/projectdetail/${id}`
        );
        setTasks(tasksResponse.data);

        const userRoleResponse = await axios.get(
          "http://127.0.0.1:8000/accounts/get_user_role"
        );
        setUserRole(userRoleResponse.data.role);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleAddComment = async () => {
    try {
      const csrftoken = getCookie('csrftoken');

      const response = await axios.post(
        `http://127.0.0.1:8000/projects/${id}/comments/`,
        { comment_text: newComment },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setComments([...comments, response.data]);
        setNewComment('');
      } else {
        console.error('Error adding comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddMeeting = async () => {
    try {
      const csrftoken = getCookie('csrftoken');

      const response = await axios.post(
        `http://127.0.0.1:8000/projects/${id}/meetings/create/`,
        {
          meeting_name: newMeetingName,
          meeting_date: newMeetingDate,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setMeetings([...meetings, response.data]);
        setNewMeetingName('');
        setNewMeetingDate('');
      } else {
        console.error('Error adding meeting:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding meeting:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      const csrftoken = getCookie('csrftoken');

      const response = await axios.post(
        `http://127.0.0.1:8000/projects/${id}/add_task/`,
        {
          task_name: newTaskName,
          task_description: newTaskDescription,
          task_status: newTaskStatus,
          task_start_date: newTaskStartDate,
          task_end_date: newTaskEndDate,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setTasks([...tasks, response.data]);
        setNewTaskName('');
        setNewTaskDescription('');
        setNewTaskStatus('Do zrobienia');
        setNewTaskStartDate('');
        setNewTaskEndDate('');
      } else {
        console.error('Error adding task:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const csrftoken = getCookie('csrftoken');

      const response = await axios.delete(
        `http://127.0.0.1:8000/projects/tasks/${taskId}/delete/`,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
          },
        }
      );

      if (response.status === 204) {
        // Remove the deleted task from the tasks state
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        console.log('Task deleted successfully.');
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilteredStatus(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDateFilter(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDateFilter(e.target.value);
  };

  const handleChangeTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/projects/change-task-status/${taskId}/`,
        { new_status: newStatus }
      );

      // Assuming your API returns the updated task data
      const updatedTask = response.data;

      // Update the tasks state with the updated task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );

      console.log("Task status updated successfully.");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const isTaskWithinDateRange = (task) => {
    if (!startDateFilter || !endDateFilter) {
      return true; // Jeśli filtry daty nie są ustawione, zwróć true, aby pokazać wszystkie zadania
    }

    const taskEndDate = new Date(task.task_end_date).getTime();
    const startDate = new Date(startDateFilter).getTime();
    const endDate = new Date(endDateFilter).getTime();

    return taskEndDate >= startDate && taskEndDate <= endDate;
  };

  const filteredTasks =
    filteredStatus === "All"
      ? tasks.filter(isTaskWithinDateRange)
      : tasks.filter(
          (task) =>
            task.task_status === filteredStatus && isTaskWithinDateRange(task)
        );

  const events = [
    ...meetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.meeting_name,
      start: new Date(meeting.meeting_date),
      end: new Date(meeting.meeting_date),
    })),
    ...filteredTasks.map((task) => ({
      id: `task-${task.id}`,
      title: `Task: ${task.task_name}`,
      start: new Date(task.task_end_date),
      end: new Date(task.task_end_date),
    })),
  ];

  const localizer = momentLocalizer(moment);

  return (
    <div className="m-4">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Project Details for {id}</Card.Title>
          <Card.Title className="mt-4">Tasks:</Card.Title>

          <Form.Group controlId="filterStatus">
            <Form.Label>Filter by Status:</Form.Label>
            <Form.Control
              as="select"
              value={filteredStatus}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="startDateFilter">
            <Form.Label>Start Date Filter:</Form.Label>
            <Form.Control
              type="date"
              value={startDateFilter}
              onChange={handleStartDateChange}
            />
          </Form.Group>

          <Form.Group controlId="endDateFilter">
            <Form.Label>End Date Filter:</Form.Label>
            <Form.Control
              type="date"
              value={endDateFilter}
              onChange={handleEndDateChange}
            />
          </Form.Group>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Task Description</th>
                <th>Task Status</th>
                <th>Task Start Date</th>
                <th>Task End Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.task_name}</td>
                  <td>{task.task_description}</td>
                  <td>
                    <Form.Control
                      as="select"
                      value={task.task_status}
                      onChange={(e) =>
                        handleChangeTaskStatus(task.id, e.target.value)
                      }
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                  <td>{new Date(task.task_start_date).toLocaleString()}</td>
                  <td>{new Date(task.task_end_date).toLocaleString()}</td>
                  {userRole === "L" && (
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          <Card.Title className="mt-4">Meetings:</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Meeting Name</th>
                <th>Meeting Date</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td>{meeting.id}</td>
                  <td>{meeting.meeting_name}</td>
                  <td>{new Date(meeting.meeting_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Card.Title className="mt-4">Comments:</Card.Title>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.user_name}:</strong> {comment.comment_text} (
                {new Date(comment.comment_add_date).toLocaleString()})
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Form.Group controlId="commentForm">
              <Form.Label>Add Comment:</Form.Label>
              <Form.Control
                className="mt-2"
                type="text"
                placeholder="Enter your comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
            <Button
              className="mt-2"
              variant="primary"
              onClick={handleAddComment}
            >
              Add Comment
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {userRole === "L" && (
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group controlId="newTaskName">
                    <Form.Label>Task Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter task name"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="newTaskDescription">
                    <Form.Label>Task Description:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter task description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="newTaskStatus">
                    <Form.Label>Task Status:</Form.Label>
                    <Form.Control
                      as="select"
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="newTaskStartDate">
                    <Form.Label>Task Start Date:</Form.Label>
                    <Form.Control
                      type="date"
                      value={newTaskStartDate}
                      onChange={(e) => setNewTaskStartDate(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="newTaskEndDate">
                    <Form.Label>Task End Date:</Form.Label>
                    <Form.Control
                      type="date"
                      value={newTaskEndDate}
                      onChange={(e) => setNewTaskEndDate(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    className="mt-2"
                    variant="primary"
                    onClick={handleAddTask}
                  >
                    Add Task
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
      

      {userRole === "L" && (
        <Card>
          <Card.Body>
            <Form>
              <Form.Group controlId="meetingForm">
                <Form.Label>Add Meeting:</Form.Label>
                <Form.Control
                  className="mt-2"
                  type="text"
                  placeholder="Meeting Name"
                  value={newMeetingName}
                  onChange={(e) => setNewMeetingName(e.target.value)}
                />
                <Form.Control
                  className="mt-2"
                  type="datetime-local"
                  placeholder="Meeting Date"
                  value={newMeetingDate}
                  onChange={(e) => setNewMeetingDate(e.target.value)}
                />
              </Form.Group>
              <Button
                className="mt-2"
                variant="primary"
                onClick={handleAddMeeting}
              >
                Add Meeting
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <div className="mt-4" style={{ height: 500 }}>
        <Calendar
          events={events}
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
