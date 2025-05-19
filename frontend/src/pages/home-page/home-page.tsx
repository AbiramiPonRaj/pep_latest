// const HomePage =() =>{
//     return(
//         <>
//         <p>hello</p></>
//     )


// }
// export default HomePage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/Login');
    }, [navigate]);
    return null;
};

export default HomePage;