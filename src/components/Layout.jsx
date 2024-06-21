import React from "react";
import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Layout = ({ children }) => {
  const navigate = useNavigate();

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
        <Button variant="ghost" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Flex>
      <Box p={4}>{children}</Box>
    </Box>
  );
};

export default Layout;