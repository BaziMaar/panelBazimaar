import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UPIManager.css';

const UPIManager = () => {
  const [upiList, setUpiList] = useState([]);
  const [newUpi, setNewUpi] = useState('');
  const [loading, setLoading] = useState(true);
  const API_KEY = 'your-api-key-here'; // Replace with your actual API key

  useEffect(() => {
    fetchUpiList();
  }, []);

  const fetchUpiList = async () => {
    try {
      const response = await axios.get('https://sattajodileak.com/user/getUPI');
      setUpiList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching UPI list:', error);
      setLoading(false);
    }
  };

  const addUpi = async () => {
    try {
      const response = await axios.get('https://sattajodileak.com/user/postUpi', { upi: newUpi }
      );
      setUpiList([...upiList, response.data]);
      setNewUpi('');
    } catch (error) {
      console.error('Error adding UPI:', error);
    }
  };

  const deleteUpi = async (upiToDelete) => {
    try {
      await axios.get('https://sattajodileak.com/user/removeUpi', {
        data: { upi: upiToDelete },
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      setUpiList(upiList.filter(upi => upi !== upiToDelete));
    } catch (error) {
      console.error('Error deleting UPI:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>UPI Manager</h1>
      <div className="input-container">
        <input
          type="text"
          value={newUpi}
          onChange={(e) => setNewUpi(e.target.value)}
          placeholder="Enter new UPI"
        />
        <button onClick={addUpi}>Add UPI</button>
      </div>
      <ul>
        {upiList.map((upi, index) => (
          <li key={index}>
            {upi}
            <button onClick={() => deleteUpi(upi)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UPIManager;
