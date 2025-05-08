// Import React and hooks for managing state and side effects
import React, { useState, useEffect } from 'react';

// Import routing utilities from react-router-dom
import { Link, useNavigate } from 'react-router-dom';

// Import Redux utilities for dispatching actions and accessing state
import { useDispatch, useSelector } from 'react-redux';

// Import the register action from userActions
import { register } from '../actions/userActions';

// Import UI components from react-bootstrap
import { Form, Button, Row, Col } from 'react-bootstrap';

// Import custom UI components for displaying messages and loaders
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import FormContainer from '../components/ui/FormContainer';

// Define the Register component
const Register = () => {
  // State variables to track user input for registration
  const [firstName, setFirstName] = useState(''); // First name of the user
  const [lastName, setLastName] = useState(''); // Last name of the user
  const [email, setEmail] = useState(''); // Email address of the user
  const [phone, setPhone] = useState(''); // Phone number of the user
  const [password, setPassword] = useState(''); // Password entered by the user
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmation of the password
  const [message, setMessage] = useState(null); // Error message for mismatched passwords

  // Initialize the dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  // Initialize the navigate function to programmatically navigate between routes
  const navigate = useNavigate();

  // Access the userRegister state from the Redux store
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister; // Extract loading, error, and userInfo from the state

  // useEffect to redirect the user if they are already registered and logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard'); // Redirect to the dashboard if registration is successful
    }
  }, [navigate, userInfo]); // Dependencies: navigate and userInfo

  /**
   * Handles the form submission for registering a new user.
   * @param {Event} e - The form submission event.
   */
  const submitHandler = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if the password and confirm password fields match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match'); // Set an error message if passwords don't match
    } else {
      // Dispatch the register action with the entered user details
      dispatch(register({ firstName, lastName, email, phone, password }));
    }
  };

  return (
    // Container for the registration form with styling
    <FormContainer>
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      {/* Display an error message if passwords don't match */}
      {message && <Message variant="danger">{message}</Message>}

      {/* Display an error message if registration fails */}
      {error && <Message variant="danger">{error}</Message>}

      {/* Display a loader while the registration request is in progress */}
      {loading && <Loader />}

      {/* Registration form */}
      <Form onSubmit={submitHandler}>
        {/* First name input field */}
        <Form.Group controlId="firstName" className="mb-4">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text" // Input type is text
            placeholder="Enter first name" // Placeholder text
            value={firstName} // Bind the input value to the firstName state
            onChange={(e) => setFirstName(e.target.value)} // Update the firstName state on input change
            required // Make the field required
          />
        </Form.Group>

        {/* Last name input field */}
        <Form.Group controlId="lastName" className="mb-4">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text" // Input type is text
            placeholder="Enter last name" // Placeholder text
            value={lastName} // Bind the input value to the lastName state
            onChange={(e) => setLastName(e.target.value)} // Update the lastName state on input change
            required // Make the field required
          />
        </Form.Group>

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

        {/* Phone number input field */}
        <Form.Group controlId="phone" className="mb-4">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel" // Input type is telephone
            placeholder="Enter phone number (e.g., +226XXXXXXXX)" // Placeholder text
            value={phone} // Bind the input value to the phone state
            onChange={(e) => setPhone(e.target.value)} // Update the phone state on input change
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

        {/* Confirm password input field */}
        <Form.Group controlId="confirmPassword" className="mb-4">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password" // Input type is password
            placeholder="Confirm password" // Placeholder text
            value={confirmPassword} // Bind the input value to the confirmPassword state
            onChange={(e) => setConfirmPassword(e.target.value)} // Update the confirmPassword state on input change
            required // Make the field required
          />
        </Form.Group>

        {/* Submit button */}
        <Button type="submit" variant="primary" className="w-full py-2">
          Register
        </Button>
      </Form>

      {/* Link to the login page for existing users */}
      <Row className="py-3">
        <Col>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

// Export the Register component for use in other parts of the application
export default Register;