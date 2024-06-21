import React from "react";
import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  return (
    <Box>
      <Flex as="nav" bg="teal.500" color="white" padding={4}>
        <Heading size="md">
          <Link to="/">MyApp</Link>
        </Heading>
        <Spacer />
        {currentUser ? (
          <>
            <Button variant="ghost" as={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" as={Link} to="/signin">
              Sign In
            </Button>
            <Button variant="ghost" as={Link} to="/signup">
              Sign Up
            </Button>
          </>
        )}
      </Flex>
      <Box p={4}>{children}</Box>
    </Box>
  );
};

export default Layout;