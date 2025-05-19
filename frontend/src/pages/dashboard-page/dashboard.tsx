import React from 'react'
import Container from 'react-bootstrap/Container';
import Header from '../../layouts/header/header';
import { Box } from '@mui/material';
const Dashboard = () => {
  return (
    <>
    <Header />
    <Box m={2}>
        <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "70px", margin: "10px" }}>
            <Box m={4}>
                <h3>Dashboard</h3>
                <div className="d-flex justify-content-center">
                    <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                        <div className="card-body">
                            Welcome Dashboard pages 
                        </div>
                    </div>
                </div>
            </Box>
        </Container>
    </Box>
    
    
 
 
</>

  )
}

export default Dashboard