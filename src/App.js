import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Grid, TextField, Button, Chip } from "@mui/material";

function App() {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get("http://localhost:3000/hash");
      const pairs = {};
      data.forEach(
        (pair) => (pairs[pair.hash] = [...(pairs[pair.hash] || []), pair.content])
      );
      setData(pairs);
    };
    fetch();
  }, []);

  const [inputData, setInputData] = useState({ hash: "", content: "" });

  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };

  const handleAddClick = async () => {
    if (!inputData.hash || !inputData.content) return;
    const response = await axios.post("http://localhost:3000/hash", {
      ...inputData,
    });
    const newPair = response.data;
    console.log(data, newPair)
    const contents = data[newPair.hash] || [];
    if (!contents.includes(newPair.content)) {
      contents.push(newPair.content);
    }
    setData({ ...data, [newPair.hash]: contents });
  };

  return (
    <div className="App">
      <Box m={5}>
        <Grid container alignItems="center" gap={5}>
          <Grid item>
            <TextField
              label="Hash"
              name="hash"
              value={inputData.hash}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Content"
              name="content"
              value={inputData.content}
              onChange={handleChange}
            />
          </Grid>
          <Button variant="contained" size="large" onClick={handleAddClick}>
            Add
          </Button>
        </Grid>
        {Object.keys(data).map((hash) => (
          <Grid container m={3} key={hash} gap={3}>
            <Chip label={hash}></Chip>
            <Box display="flex" flexDirection="column">
              {data[hash].map((content, i) => (
                <Chip label={content} key={i} variant="outlined"></Chip>
              ))}
            </Box>
          </Grid>
        ))}
      </Box>
    </div>
  );
}

export default App;
