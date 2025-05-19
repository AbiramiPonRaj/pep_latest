import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layouts/header/header';
import Identify from './Identify';

const ManagerView = () => {
    const navigate = useNavigate();

    useEffect(() => {
        <Identify/>
       
    }, [navigate]);

    return (
        <>
            <Header />
            
        </>
    );
};

export default ManagerView;
