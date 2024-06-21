import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Container, Button, VStack, HStack, Input, Table, Thead, Tbody, Tr, Th, Td, Select, Text } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFileExport, FaFileImport } from "react-icons/fa";
import Papa from "papaparse";
import { useAuth } from "../contexts/AuthContext";

const fetchSuggestedContactsFromServer = async () => {
  // Mock implementation for fetching suggested contacts
  return [
    { name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
    { name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210" },
  ];
};

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState("");
  const [suggestedContacts, setSuggestedContacts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    let storedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
    if (filter) {
      storedContacts = storedContacts.filter(contact => contact.name.includes(filter) || contact.email.includes(filter) || contact.phone.includes(filter));
    }
    if (sortOrder === "asc") {
      storedContacts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      storedContacts.sort((a, b) => b.name.localeCompare(a.name));
    }
    setContacts(storedContacts);
  }, [filter, sortOrder]);

  useEffect(() => {
    const fetchSuggestedContacts = async () => {
      // Logic to fetch suggested contacts from the server
      const suggestions = await fetchSuggestedContactsFromServer();
      setSuggestedContacts(suggestions);
    };
    fetchSuggestedContacts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = () => {
    if (editingIndex !== null) {
      const updatedContacts = contacts.map((contact, index) =>
        index === editingIndex ? newContact : contact
      );
      setContacts(updatedContacts);
      setEditingIndex(null);
    } else {
      setContacts([...contacts, newContact]);
    }
    setNewContact({ name: "", email: "", phone: "" });
    localStorage.setItem("contacts", JSON.stringify([...contacts, newContact]));
  };

  const handleEditContact = (index) => {
    setNewContact(contacts[index]);
    setEditingIndex(index);
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(contacts);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contacts.csv";
    link.click();
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setContacts(results.data);
          localStorage.setItem("contacts", JSON.stringify(results.data));
        },
      });
    }
  };

  return (
    <Layout>
      <Container centerContent maxW="container.md" py={8}>
        <VStack spacing={4} width="100%">
          <HStack spacing={4} width="100%">
            <Input
              placeholder="Name"
              name="name"
              value={newContact.name}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Email"
              name="email"
              value={newContact.email}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Phone"
              name="phone"
              value={newContact.phone}
              onChange={handleInputChange}
            />
            <Button onClick={handleAddContact} colorScheme="teal" leftIcon={<FaPlus />}>
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </HStack>
          <HStack spacing={4} width="100%">
            <Input
              placeholder="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </HStack>
          <Table variant="simple" width="100%">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contacts.map((contact, index) => (
                <Tr key={index}>
                  <Td>{contact.name}</Td>
                  <Td>{contact.email}</Td>
                  <Td>{contact.phone}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button size="sm" onClick={() => handleEditContact(index)} leftIcon={<FaEdit />}>
                        Edit
                      </Button>
                      <Button size="sm" onClick={() => handleDeleteContact(index)} colorScheme="red" leftIcon={<FaTrash />}>
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <HStack spacing={4} width="100%">
            <Button onClick={handleExportCSV} colorScheme="blue" leftIcon={<FaFileExport />}>
              Export CSV
            </Button>
            <Button as="label" colorScheme="green" leftIcon={<FaFileImport />}>
              Import CSV
              <Input type="file" accept=".csv" onChange={handleImportCSV} hidden />
            </Button>
          </HStack>
          <VStack spacing={4}>
            {suggestedContacts.map((contact, index) => (
              <Text key={index}>{contact.name}</Text>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Layout>
  );
};

export default Contacts;