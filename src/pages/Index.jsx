import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Container, Button, VStack, Text, HStack, Box } from "@chakra-ui/react";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import io from "socket.io-client";
import Peer from "simple-peer";
import Layout from "../components/Layout";

const Index = () => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [id, setId] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [missedCalls, setMissedCalls] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const { currentUser } = useAuth();
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socket = useRef();

  const fetchCallHistoryFromServer = async () => {
    // Mock implementation for fetching call history
    return [
      { name: "John Doe", duration: 10 },
      { name: "Jane Smith", duration: 15 },
    ];
  };

  useEffect(() => {
    socket.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    });

    socket.current.on("me", (id) => {
      setId(id);
    });

    socket.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    socket.current.on("missedCall", (data) => {
      setMissedCalls(prev => [...prev, data]);
      // Logic to send email notification
    });

    const fetchCallHistory = async () => {
      // Logic to fetch call history from the server
      const history = await fetchCallHistoryFromServer();
      setCallHistory(history);
    };
    fetchCallHistory();
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: id,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <Layout>
      <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <VStack spacing={4}>
          <Text fontSize="2xl">Video Calling App</Text>
          <Box>
            {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
          </Box>
          <Box>
            {callAccepted && !callEnded ? (
              <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
            ) : null}
          </Box>
          <HStack spacing={4}>
            {callAccepted && !callEnded ? (
              <Button onClick={leaveCall} colorScheme="red" leftIcon={<FaVideoSlash />}>
                End Call
              </Button>
            ) : (
              <Button onClick={() => callUser(id)} colorScheme="teal" leftIcon={<FaVideo />}>
                Call
              </Button>
            )}
            {receivingCall && !callAccepted ? (
              <Button onClick={answerCall} colorScheme="green" leftIcon={<FaVideo />}>
                Answer
              </Button>
            ) : null}
          </HStack>
          <VStack spacing={4}>
            {missedCalls.map((call, index) => (
              <Text key={index} color="red.500">Missed call from {call.name}</Text>
            ))}
          </VStack>
          <VStack spacing={4}>
            {callHistory.map((call, index) => (
              <Text key={index}>{call.name} - {call.duration} minutes</Text>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Layout>
  );
};

export default Index;