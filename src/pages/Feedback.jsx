import React, { useState } from "react";
import Layout from "../components/Layout";
import { Container, Button, VStack, Textarea, Heading, Text } from "@chakra-ui/react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackSubmit = async () => {
    try {
      await addDoc(collection(db, "feedback"), {
        feedback,
        timestamp: new Date(),
      });
      setMessage("Feedback submitted successfully!");
      setFeedback("");
    } catch (error) {
      setMessage("Error submitting feedback. Please try again.");
    }
  };

  return (
    <Layout>
      <Container centerContent>
        <VStack spacing={4} width="100%" maxW="md" mt={10}>
          <Heading>Call Feedback</Heading>
          {message && <Text color="green.500">{message}</Text>}
          <Textarea
            placeholder="Please provide your feedback on the call quality and experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button onClick={handleFeedbackSubmit} colorScheme="teal" width="100%">
            Submit Feedback
          </Button>
        </VStack>
      </Container>
    </Layout>
  );
};

export default Feedback;