import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

axios.defaults.withCredentials = true;

const ProjectDetails = () => {
  const { id } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newMeetingName, setNewMeetingName] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meetings
        const meetingsResponse = await axios.get(`http://127.0.0.1:8000/projects/${id}/meetings`);
        setMeetings(meetingsResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(`http://127.0.0.1:8000/projects/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMeetings([]);
        setComments([]);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // This effect will run whenever comments change
    const handleCommentChange = async () => {
      try {
        const updatedCommentsResponse = await axios.get(`http://127.0.0.1:8000/projects/${id}/comments`);
        setComments(updatedCommentsResponse.data);
      } catch (error) {
        console.error('Error fetching updated comments:', error);
      }
    };

    handleCommentChange();
  }, [comments, id]);

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

      if (response.status === 200) {
        // Comment added successfully, useEffect will handle the update
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
        // Meeting added successfully, manually trigger fetch for updated meetings
        const updatedMeetingsResponse = await axios.get(`http://127.0.0.1:8000/projects/${id}/meetings`);
        setMeetings(updatedMeetingsResponse.data);

        setNewMeetingName('');
        setNewMeetingDate('');
      } else {
        console.error('Error adding meeting:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding meeting:', error);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Prepare events for the calendar
  const events = meetings.map((meeting) => ({
    id: meeting.id,
    title: meeting.meeting_name,
    start: new Date(meeting.meeting_date),
    end: new Date(meeting.meeting_date),
  }));

  const localizer = momentLocalizer(moment);

  return (
    <div>
      <h2>Project Details for Project ID: {id}</h2>

      <h3>Meetings:</h3>
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

      <h3>Comments:</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <strong>{comment.user_name}:</strong> {comment.comment_text} ({new Date(comment.comment_add_date).toLocaleString()})
          </li>
        ))}
      </ul>

      <Form>
        <Form.Group controlId="commentForm">
          <Form.Label>Add Comment:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddComment}>
          Add Comment
        </Button>
      </Form>

      <Form>
        <Form.Group controlId="meetingForm">
          <Form.Label>Add Meeting:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Meeting Name"
            value={newMeetingName}
            onChange={(e) => setNewMeetingName(e.target.value)}
          />
          <Form.Control
            type="datetime-local"
            placeholder="Meeting Date"
            value={newMeetingDate}
            onChange={(e) => setNewMeetingDate(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddMeeting}>
          Add Meeting
        </Button>
      </Form>

      <div style={{ height: 500 }}>
        <Calendar
          events={events}
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          style={{ margin: '20px' }}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
