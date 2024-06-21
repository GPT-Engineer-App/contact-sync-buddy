import React from "react";
import Layout from "../components/Layout";
import { Box, Heading, Text } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Layout>
      <Box p={4}>
        <Heading>Dashboard</Heading>
        <Text mt={4}>Welcome to your dashboard. Here you can manage your account and use the application's features.</Text>
      </Box>
    </Layout>
  );
};

export default Dashboard;