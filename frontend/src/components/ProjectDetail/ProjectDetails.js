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

  const handleAddComment = async () => {
    try {
      // ... (existing code for adding comments)
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddMeeting = async () => {
    try {
      // ... (existing code for adding meetings)
    } catch (error) {
      console.error("Error adding meeting:", error);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const events = [
    ...meetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.meeting_name,
      start: new Date(meeting.meeting_date),
      end: new Date(meeting.meeting_date),
    })),
    ...tasks.map((task) => ({
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
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.task_name}</td>
                  <td>{task.task_description}</td>
                  <td>{task.task_status}</td>
                  <td>{new Date(task.task_start_date).toLocaleString()}</td>
                  <td>{new Date(task.task_end_date).toLocaleString()}</td>
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

      {userRole === 'L' && (
        <Card>
          <Card.Body>
            <Form>
              <Form.Group controlId="meetingForm">
                <Form.Label>Add Meeting:</Form.Label>
                <Form.Control
                  className='mt-2'
                  type="text"
                  placeholder="Meeting Name"
                  value={newMeetingName}
                  onChange={(e) => setNewMeetingName(e.target.value)}
                />
                <Form.Control
                  className='mt-2'
                  type="datetime-local"
                  placeholder="Meeting Date"
                  value={newMeetingDate}
                  onChange={(e) => setNewMeetingDate(e.target.value)}
                />
              </Form.Group>
              <Button className='mt-2' variant="primary" onClick={handleAddMeeting}>
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
