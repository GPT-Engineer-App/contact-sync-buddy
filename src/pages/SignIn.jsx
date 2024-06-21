import React, { useState } from "react";
import { Container, Button, VStack, Input, Heading, Text } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container centerContent>
      <VStack spacing={4} width="100%" maxW="md" mt={10}>
        <Heading>Sign In</Heading>
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
        <Button onClick={handleSignIn} colorScheme="teal" width="100%">
          Sign In
        </Button>
        <Text color="teal.500" cursor="pointer" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </Text>
      </VStack>
    </Container>
  );
};

export default SignIn;