import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const ReferredDetails = () => {
  const { phone } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [winAmount, setWinningAmount] = useState(0);
  const [looseAmount, setLosingAmount] = useState(0);
  const [refAmount, setRefAmount] = useState(0);
  let [columns, setColumns] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://sattajodileak.com/wallet/getReferred?phone=${phone}`);
      const transactions = response.data.referred;
      console.log(transactions)

      const grouped = transactions.reduce((acc, transaction) => {
        const userId = transaction.user_id;
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push(transaction);
        return acc;
      }, {});

      const refAmount = transactions
      .filter(transaction => transaction.amount > 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
      setRefAmount(refAmount.toFixed(2));
      
      const winAmount = transactions
        .filter(transaction => transaction.deposit_amount > 0)
        .reduce((acc, transaction) => acc + transaction.deposit_amount, 0);

      const looseAmount = transactions
        .filter(transaction => transaction.withdraw_amount < 0)
        .reduce((acc, transaction) => acc + transaction.withdraw_amount, 0);

      setTransactions(transactions);
      setGroupedTransactions(grouped);
      setWinningAmount(winAmount);
      setLosingAmount(looseAmount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
    }
    fetchData();
  }, []);  // Empty dependency array, runs only once on mount

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  columns = [
    { field: 'user_id', headerName: 'User ID', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'avatar', headerName: 'Avatar', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'time', headerName: 'Time', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    {field:'deposit_amount',headerName:'Deposit Amount',width:150},
    {field:'withdraw_amount',headerName:'Withdraw Amount',width:150},
  ];

  const linkStyle = {
    textDecoration: 'none',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
    color: 'black',
    background: '#DADADA'
  };

  linkStyle[':hover'] = {
    color: '#007bff',
  };

  return (
    <div>
      {/* Header with Sidebar Button */}
      <header
        style={{
          textAlign: 'center',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          background: '#F1F1F1',
          color: 'black'
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
          <h2 style={{ color: 'black' }}>History of Users Transactions</h2>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div style={{ width: '250px', padding: '20px', background: '#DADADA' }}>
          {/* List of links in the drawer */}
          <Link to="/" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Transactions</Link>
          <Link to="/pending" onClick={() => setDrawerOpen(false)} style={linkStyle}>Pending Withdrawal Requests</Link>
          <Link to="/approved" onClick={() => setDrawerOpen(false)} style={linkStyle}>Approved Transactions</Link>
          <Link to="/users" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Users</Link>
          <Link to="/lastUsers" onClick={() => setDrawerOpen(false)} style={linkStyle}>Last 7 days Users</Link>
        </div>
      </Drawer>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px', background: '#F1F1F1' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Card sx={{ maxWidth: 275, background: 'white', color: 'black' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Deposit Amount
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {winAmount}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ maxWidth: 300, background: 'white', color: 'black' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Withdraw Amount
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {looseAmount}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ maxWidth: 275, background: 'white', color: 'black' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Refer Earn Amount
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {refAmount}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {Object.keys(groupedTransactions).map((userId) => (
          <div key={userId} style={{ marginBottom: '20px' }}>
            <Typography variant="h6" component="div" style={{ margin: '10px 0' }}>
              User ID: {userId}
            </Typography>
            <DataGrid
              rows={groupedTransactions[userId].map(transaction => ({
                id: transaction._id,
                user_id: transaction.user_id,
                amount: transaction.amount.toFixed(2),
                avatar: transaction.avatar,
                date: moment(transaction.createdAt).format('YYYY-MM-DD'),
                time: moment(transaction.createdAt).format('HH:mm:ss'),
                type: transaction.amount > 0 ? 'Deposit' : 'Withdraw',
                deposit_amount:transaction?.deposit_amount>0?transaction?.deposit_amount:0,
                withdraw_amount:transaction?.withdraw_amount>0?transaction?.withdraw_amount:0
              }))}
              columns={columns}
              pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              sx={{
                '&.MuiDataGrid-root': {
                  bgcolor: '#DADADA',
                  color: 'black',
                  borderColor: 'transparent',
                },
              }}
            />
          </div>
        ))}
      </div>

      <footer style={{ textAlign: 'center', padding: '10px', color: '#99E9FA', background: '#DADADA' }}>
        <p>&copy; 2024 baazi Maar</p>
      </footer>
    </div>
  );
};

export default ReferredDetails;
