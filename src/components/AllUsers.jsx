import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Drawer, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CrossIcon from '../assets/cross.svg';

const AllUsers = () => {
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [addMoney, setAddMoney] = useState(null);
  const [deductMoney, setDeductMoney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://sattajodileak.com/user/getUser`);
        setTransactions(response.data.data);

        const formattedData = response.data.data.map((transaction) => ({
          id: transaction._id,
          name: transaction.name,
          phone: transaction.phone,
          email: transaction.email,
          wallet: transaction.wallet.toFixed(2),
          withdrawal_amount: Math.abs(transaction.withdrawal_amount).toFixed(2),
          referred_wallet: Math.abs(transaction.referred_wallet).toFixed(2),
          created_at: moment(transaction.createdAt).format('YYYY-MM-DD'), 
          referred_users: transaction.refer_id
        }));

        setData(formattedData);

        const tableColumns = [
          { field: 'name', headerName: 'Name', width: 200 },
          { field: 'phone', headerName: 'Phone', width: 220 },
          { field: 'email', headerName: 'Email', width: 220 },
          { field: 'wallet', headerName: 'Wallet', width: 180 },
          { field: 'withdrawal_amount', headerName: 'Withdrawal Amount', width: 220 },
          { field: 'referred_wallet', headerName: 'Referred Wallet', width: 220 },
          { field: 'created_at', headerName: 'Created At', width: 180 },
          { field: 'referred_users', headerName: 'Referred Users', width: 200 },
          {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
              <Button variant="contained" size="small" onClick={() => handleOpenModal(params.row.phone)}>
                Action
              </Button>
            ),
          },
          {
            field: 'transactionsButton',
            headerName: 'Transactions',
            width: 150,
            renderCell: (params) => (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handlePayment(params.row.phone)}
                >
                  Transactions
                </Button>
            ),
          },
          {
            field: 'betButton',
            headerName: 'Aviator Bet',
            width: 150,
            renderCell: (params) => (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleBet(params.row.phone)}
                >
                  Bet
                </Button>
            ),
          },
          {
            field: 'dragonTigerBetButton',
            headerName: 'Dragon Tiger Bet',
            width: 150,
            renderCell: (params) => (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleBet(params.row.phone)}
                >
                  Bet
                </Button>
            ),
          },
          {
            field: 'colorRajaBetButton',
            headerName: 'Color Raja Bet',
            width: 150,
            renderCell: (params) => (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleBet(params.row.phone)}
                >
                  Bet
                </Button>
            ),
          },
          {
            field: 'minesBetButton',
            headerName: 'Mines Bet',
            width: 150,
            renderCell: (params) => (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleBet(params.row.phone)}
                >
                  Bet
                </Button>
            ),
          }
          
        ];

        setIsLoading(false); 
        setColumns(tableColumns);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBet = (phone) => {
    navigate(`/bet/${phone}`);
  };

  const handlePayment = (phone) => {
    navigate(`/history/${phone}`);
  };

  const handleOpenModal = (phone) => {
    setOpenModal(true);
    setPhone(phone);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAddMoney('');
    setDeductMoney('');
  };

  const handleAddMoneyChange = (event) => {
    const value = event.target.value;
    setAddMoney(value !== '' ? parseInt(value, 10) : null);
  };

  const handleDeductMoneyChange = (event) => {
    const value = event.target.value;
    setDeductMoney(value !== '' ? parseInt(value, 10) : null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSubmit = async () => {
    try {
      let apiEndpoint;
      let requestData;

      if (addMoney !== null) {
        apiEndpoint = `${import.meta.env.VITE_REACT_APP_BASE_URL}/wallet/deposit`;
        requestData = {
          phone,
          amount: addMoney,
        };
      } else if (deductMoney !== null) {
        apiEndpoint = `${import.meta.env.VITE_REACT_APP_BASE_URL}/wallet/withdraw`;
        requestData = {
          phone,
          amount: deductMoney,
        };
      } else {
        return;
      }

      const response = await axios.post(apiEndpoint, requestData);
      console.log(response.data);

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'lightblue',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
  };

  linkStyle[':hover'] = {
    color: '#007bff',
  };

  return (
    <div style={{ backgroundColor: '#081A30', color: 'lightblue', minHeight: '100vh' }}>
      <header
        style={{
          backgroundColor: '#102339',
          color: 'lightblue',
          textAlign: 'center',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow
          zIndex: 1, // Ensure header is on top of other elements
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ marginLeft: '6in' }}>
          <h2 style={{ color: 'lightblue' }}>All Users</h2>
        </div>
      </header>

      {/* Drawer component */}
      <Drawer 
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <div style={{ textAlign: 'left', padding: '10px', background:'#102339',  }}>
          <img src={CrossIcon} alt="Hamburger Icon" style={{ width: '25px', height: '25px', cursor: 'pointer', background:'white', borderRadius:'17px'}} onClick={toggleDrawer(false)}/>
        </div>
        <div style={{ height: '100vh', width: '250px', padding: '20px', background: '#102339'}}>
          <Link to="/transaction" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Transactions</Link>
          <Link to="/pending" onClick={() => setDrawerOpen(false)} style={linkStyle}>Pending Requests</Link>
          <Link to="/approved" onClick={() => setDrawerOpen(false)} style={linkStyle}>Approved Transactions</Link>
          <Link to="/users" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Users</Link>
          <Link to="/weeklyUsers" onClick={() => setDrawerOpen(false)} style={linkStyle}>Weekly Users</Link>
          <Link to="/daily" onClick={() => setDrawerOpen(false)} style={linkStyle}>Daily Transactions</Link>
          <Link to="/week" onClick={() => setDrawerOpen(false)} style={linkStyle}>Weekly Transactions</Link>
        </div>
      </Drawer>

      {/* DataGrid component */}
      {isLoading ? ( // Conditional rendering based on loading state
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)'}}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          <DataGrid style={{ background:'#081A30', color: 'lightblue' }}
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* Chart component */}
      <div style={{ padding: '20px' }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="wallet" fill="#8884d8" />
            <Bar dataKey="withdrawal_amount" fill="#82ca9d" />
            <Bar dataKey="referred_wallet" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dialog component */}
      <Dialog open={openModal} onClose={handleCloseModal} style={{background:'#081A30', color: 'lightblue'}}>
        <DialogTitle>Add/Deduct Money</DialogTitle>
        <DialogContent>
          <TextField
            label="Add Money"
            type="number"
            value={addMoney}
            onChange={handleAddMoneyChange}
          />
          <TextField
            label="Deduct Money"
            type="number"
            value={deductMoney}
            onChange={handleDeductMoneyChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
};

export default AllUsers;
