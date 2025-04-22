import React, { useState, useEffect } from 'react';
import './Form.css';

export default function Form() {
  const [gatewayIp, setGatewayIp] = useState('');
  const [port, setPort]       = useState(3000);
  const [file, setFile]       = useState(null);
  const [status, setStatus]   = useState('');

  // On mount: fetch the hotspot gateway IP
  useEffect(() => {
    // fetch('http://localhost:3001/gateway')
    fetch('https://sb-backend-1i4s.onrender.com/gateway')
      .then(res => res.json())
      .then(data => setGatewayIp(data.gateway))
      .catch(err => {
        console.error('Could not get gateway IP:', err);
        setStatus('Failed to detect hotspot IP');
      });
  }, []);

  const handleSend = async () => {
    if (!gatewayIp || !file) {
      setStatus('Waiting for IP detection & file selection');
      return;
    }
    setStatus('Sending…');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = `http://${gatewayIp}:${port}/ot`;
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setStatus('✅ File sent successfully!');
      } else {
        setStatus(`❌ Send failed: ${res.status}`);
      }
    } catch (err) {
      setStatus('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Send File to Mobile Hotspot</h2>

      <label>
        Detected Hotspot IP:
        <input
          type="text"
          value={gatewayIp || 'Detecting…'}
          readOnly
        />
      </label>

      <label>
        Port:
        <input
          type="number"
          value={port}
          onChange={e => setPort(e.target.value)}
        />
      </label>

      <label>
        Select File:
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />
      </label>

      <button
        className="send-button"
        onClick={handleSend}
        disabled={!gatewayIp || !file}
      >
        Send
      </button>

      <p className="status">{status}</p>
    </div>
  );
}
