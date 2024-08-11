"use client";
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  getDoc,
  doc,
} from "firebase/firestore";

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Material+Icons+Two+Tone"
/>;

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false); // State to manage no results found

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const InventoryList = [];
    docs.forEach((doc) => {
      InventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(InventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    // Update the noResults state based on the filtered inventory
    const filtered = inventory.filter(({ name }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setNoResults(filtered.length === 0 && searchQuery.trim() !== "");
  }, [searchQuery, inventory]);

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity <= 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
      await updateInventory();
    }
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const clearItems = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  const deleteAll = async () => {
    // Use forEach to perform an action on each item
    inventory.forEach(async ({ name }) => {
      await clearItems(name);
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      bgcolor="#ffffff" // White
      p={4}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position={"absolute"}
          top={"50%"}
          left={"50%"}
          width={400}
          bgcolor={"#ffffff"} // White
          borderRadius={4}
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6" color="#52424d">
            Add New Item
          </Typography>
          <Stack width={"100%"} direction={"row"} spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ bgcolor: "#f5f5f5" }} // Light gray for text field background
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
              sx={{
                bgcolor: "#714b67", // Dark mauve
                color: "#ffffff", // White
                "&:hover": { bgcolor: "#52424d" }, // Dark gray
                "&:active": { bgcolor: "#52424d" }, // Dark gray
                "&:disabled": { bgcolor: "#714b67" }, // Dark mauve
              }}
            >
              <Typography variant="h4">+</Typography>
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box width={"800px"} display={"flex"} justifyContent={"center"}>
        <TextField
          variant="outlined"
          placeholder="Search Inventory"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "100%", maxWidth: "500px", mb: 2, bgcolor: "#f5f5f5" }} // Light gray for text field background
        />
      </Box>
      <Box
        width={"800px"}
        borderRadius={4}
        overflow={"hidden"}
        boxShadow={2}
        bgcolor={"#ffffff"} // White
        p={2}
      >
        <Box
          height={"100px"}
          bgcolor={"#714b67"} // Dark mauve
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography variant="h3" color={"#ffffff"}>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width={"100%"}
          height={"300px"}
          spacing={2}
          overflow={"auto"}
          p={2}
        >
          {filteredInventory.length === 0 && noResults ? (
            <Typography variant="h6" color="#52424d" align="center">
              No items found
            </Typography>
          ) : (
            filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width={"100%"}
                minHeight={"150px"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                bgcolor={"#f5f5f5"} // Light gray
                p={2}
                borderRadius={4}
                boxShadow={1}
              >
                <Typography variant="h6" color="#52424d">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="#52424d">
                  {quantity}
                </Typography>
                <Stack direction={"row"} spacing={"5px"}>
                  <Button
                    variant="contained"
                    onClick={() => addItem(name)}
                    sx={{
                      bgcolor: "#4CAF50", // Green
                      color: "#ffffff", // White text
                      "&:hover": { bgcolor: "#388E3C" }, // Darker green for hover
                      "&:active": { bgcolor: "#2C6B3F" }, // Even darker green for active state
                      "&:disabled": { bgcolor: "#4CAF50" }, // Same green for disabled state
                    }}
                  >
                    +
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeItem(name)}
                    sx={{
                      bgcolor: "#D32F2F",
                      color: "#ffffff", // White
                      "&:hover": { bgcolor: "#C62828" },
                      "&:active": { bgcolor: "#B71C1C" },
                    }}
                  >
                    -
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => clearItems(name)}
                    sx={{
                      bgcolor: "#D32F2F",
                      color: "#ffffff", // White
                      "&:hover": { bgcolor: "#C62828" },
                      "&:active": { bgcolor: "#B71C1C" },
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: "#232b2b", fontSize: "25px" }}
                    />
                  </Button>
                </Stack>
              </Box>
            ))
          )}
        </Stack>
      </Box>
      <Box width={"600px"} display={"flex"} justifyContent={"space-around"}>
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{
            bgcolor: "#714b67", // Dark mauve
            color: "#ffffff", // White
            mt: 2,
            "&:hover": { bgcolor: "#52424d" }, // Dark gray
            "&:active": { bgcolor: "#52424d" }, // Dark gray
            "&:disabled": { bgcolor: "#714b67" }, // Dark mauve
          }}
        >
          Add Item
        </Button>
        <Button
          variant="contained"
          onClick={() => deleteAll()}
          sx={{
            bgcolor: "#714b67", // Dark mauve
            color: "#ffffff", // White
            mt: 2,
            "&:hover": { bgcolor: "#52424d" }, // Dark gray
            "&:active": { bgcolor: "#52424d" }, // Dark gray
            "&:disabled": { bgcolor: "#714b67" }, // Dark mauve
          }}
        >
          clear
        </Button>
      </Box>
    </Box>
  );
}
