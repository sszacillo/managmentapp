import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true); // eslint-disable-next-line
  const [submitting, setSubmitting] = useState(false); 
  const [disabledButtons, setDisabledButtons] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/notifications/', {
        credentials: 'include',
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setNotifications(data);
        console.log('Received notifications data:', data);
      } else {
        console.error('Invalid notifications data received:', data);
      }

      setLoadingNotifications(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoadingNotifications(false);
    }
  };
  

  const handleMarkAsSeen = async (notificationId) => {
    try {
      setSubmitting(true);

      const response = await fetch(`http://127.0.0.1:8000/accounts/notifications/${notificationId}/change-status/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_status: 'seen' }),
      });

      if (response.ok) {
        // Aktualizacja lokalnego stanu po udanym zaktualizowaniu statusu
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            notification_status: notification.id === notificationId ? 'seen' : notification.notification_status,
          }))
        );

        // Dezaktywacja przycisku dla zaktualizowanej notyfikacji
        setDisabledButtons((prevDisabledButtons) => [...prevDisabledButtons, notificationId]);
      } else {
        console.error('Error updating notifications status:', response.status);
      }
    } catch (error) {
      console.error('Error updating notifications status:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Project Management - Notifications</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Link to="/projects" className="btn btn-light m-2">
              Projects
            </Link>
            <Link to="/projects/create" className="btn btn-light m-2">
              Create Project
            </Link>
            <Navbar.Text style={{ marginLeft: '5%' }}>
              <Button onClick={() => navigate('/')} variant="light">
                Log out
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {loadingNotifications ? (
        <Card style={{ marginTop: '5%' }}>
          <Card.Body>
            <Card.Text className="text-center">Loading notifications...</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        notifications.length === 0 ? (
          <Card style={{ marginTop: '5%' }}>
              <Card.Body>
                <Card.Text className="text-center">No notification available.</Card.Text>
              </Card.Body>
            </Card>
        ) : (
          <>
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                style={{ width: '90%', margin: '2%', cursor: 'pointer' }}
                onClick={() => handleMarkAsSeen(notification.id)}
              >
                <Card.Body>
                  <Card.Title>{notification.notification_type}</Card.Title>
                  <Card.Text>Date: {notification.notification_date}</Card.Text>
                  <Card.Text>Status: {notification.notification_status}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Zapobiega wywołaniu onClick dla karty
                      handleMarkAsSeen(notification.id);
                    }}
                    disabled={disabledButtons.includes(notification.id) || notification.notification_status === 'seen'}
                  >
                    Mark as Seen
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </>
        )
      )}
      </div>
    </div>
  );
};

export default Notifications;
