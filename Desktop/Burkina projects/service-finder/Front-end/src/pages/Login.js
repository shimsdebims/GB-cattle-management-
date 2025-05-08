// Import React and hooks for managing state and side effects
import React, { useState, useEffect } from 'react';

// Import routing utilities from react-router-dom
import { Link, useNavigate } from 'react-router-dom';

// Import Redux utilities for dispatching actions and accessing state
import { useDispatch, useSelector } from 'react-redux';

// Import the login action from userActions
import { login } from '../actions/userActions';

// Import UI components from react-bootstrap
import { Form, Button, Row, Col } from 'react-bootstrap';

// Import custom UI components for displaying messages and loaders
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import FormContainer from '../components/ui/FormContainer';

// Define the Login component
const Login = () => {
  // State variables to track the email and password entered by the user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Initialize the dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  // Initialize the navigate function to programmatically navigate between routes
  const navigate = useNavigate();

  // Access the userLogin state from the Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin; // Extract loading, error, and userInfo from the state

  // useEffect to redirect the user if they are already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard'); // Redirect to the dashboard if the user is logged in
    }
  }, [navigate, userInfo]); // Dependencies: navigate and userInfo

  /**
   * Handles the form submission for logging in.
   * @param {Event} e - The form submission event.
   */
  const submitHandler = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    dispatch(login(email, password)); // Dispatch the login action with the entered email and password
  };

  return (
    // Container for the login form with styling
    <FormContainer>
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>

      {/* Display an error message if login fails */}
      {error && <Message variant="danger">{error}</Message>}

      {/* Display a loader while the login request is in progress */}
      {loading && <Loader />}

      {/* Login form */}
      <Form onSubmit={submitHandler}>
        {/* Email input field */}
        <Form.Group controlId="email" className="mb-4">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email" // Input type is email
            placeholder="Enter email" // Placeholder text
            value={email} // Bind the input value to the email state
            onChange={(e) => setEmail(e.target.value)} // Update the email state on input change
            required // Make the field required
          />
        </Form.Group>

        {/* Password input field */}
        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password" // Input type is password
            placeholder="Enter password" // Placeholder text
            value={password} // Bind the input value to the password state
            onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
            required // Make the field required
          />
        </Form.Group>

        {/* Submit button */}
        <Button type="submit" variant="primary" className="w-full py-2">
          Sign In
        </Button>
      </Form>

      {/* Link to the registration page for new users */}
      <Row className="py-3">
        <Col>
          New Customer?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800">
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

// Export the Login component for use in other parts of the application
export default Login;