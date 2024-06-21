import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Container, Button, VStack, Input, Heading, Text, Select } from "@chakra-ui/react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useRole } from "../contexts/RoleContext";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("");
  const [message, setMessage] = useState("");
  const { role } = useRole();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async () => {
    try {
      const userDoc = doc(db, "users", selectedUser);
      await updateDoc(userDoc, { role: newRole });
      setMessage("Role updated successfully!");
    } catch (error) {
      setMessage("Error updating role. Please try again.");
    }
  };

  if (role !== "admin") {
    return (
      <Layout>
        <Container centerContent>
          <Text>You do not have access to this page.</Text>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container centerContent>
        <VStack spacing={4} width="100%" maxW="md" mt={10}>
          <Heading>Admin Panel</Heading>
          {message && <Text color="green.500">{message}</Text>}
          <Select placeholder="Select user" onChange={(e) => setSelectedUser(e.target.value)}>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </Select>
          <Input
            placeholder="New Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <Button onClick={handleRoleChange} colorScheme="teal" width="100%">
            Update Role
          </Button>
        </VStack>
      </Container>
    </Layout>
  );
};

export default Admin;