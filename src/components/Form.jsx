import React, { useState } from 'react'

function Form() {
    const [ipAddress, setIpAddress] = useState("");
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [port,setPort]=useState(3000);
    const handleSend = async () => {
      if (!ipAddress || !file) {
        setStatus("Please enter IP and select a file.");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch(`http://${ipAddress}/${port}/ot`, {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          setStatus("File sent successfully!");
        } else {
          setStatus(`Failed to send: ${response.status}`);
        }
      } catch (err) {
        setStatus("Error: " + err.message);
      }
    };
  
    return (
      <div className="container">
        <h2>Send File to IP</h2>
        <input
          type="text"
          placeholder="Enter IP:Port (e.g. 192.168.1.100:3000)"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleSend}>Send</button>
        <p>{status}</p>
      </div>
    );
  };

export default Form
