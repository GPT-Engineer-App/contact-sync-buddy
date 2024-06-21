import React, { useState } from "react";
import { Container, Button, VStack, Input, Heading, Text } from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container centerContent>
      <VStack spacing={4} width="100%" maxW="md" mt={10}>
        <Heading>Sign Up</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignUp} colorScheme="teal" width="100%">
          Sign Up
        </Button>
      </VStack>
    </Container>
  );
};

export default SignUp;