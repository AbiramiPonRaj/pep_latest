// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { clearLoginDetails } from '../../pages/login/State/authActions';

// const useInactivityTimeout = (timeout: number = 60000) => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const handleLogout = () => {
//             dispatch(clearLoginDetails());
//             sessionStorage.removeItem('loginDetails');
//             localStorage.removeItem('loginDetails');
//             navigate('/login');
//         };

//         let inactivityTimer = setTimeout(handleLogout, timeout);

//         const resetTimeout = () => {
//             clearTimeout(inactivityTimer);
//             inactivityTimer = setTimeout(handleLogout, timeout);
//         };

//         window.addEventListener('mousemove', resetTimeout);
//         window.addEventListener('mousedown', resetTimeout);
//         window.addEventListener('keypress', resetTimeout);
//         window.addEventListener('scroll', resetTimeout);

//         return () => {
//             clearTimeout(inactivityTimer);
//             window.removeEventListener('mousemove', resetTimeout);
//             window.removeEventListener('mousedown', resetTimeout);
//             window.removeEventListener('keypress', resetTimeout);
//             window.removeEventListener('scroll', resetTimeout);
//         };
//     }, [navigate, dispatch, timeout]);
// };

// export default useInactivityTimeout;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionTimeoutHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleUserActivity = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Clear session and set timeout flag
        sessionStorage.clear(); // Or other session clearing logic
        sessionStorage.setItem('sessionTimedOut', 'true');
        navigate('/login', { replace: true }); // Redirect to login
      }, 7200000);
    };
//
    // Add event listeners
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    // Set initial timer
    handleUserActivity();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [navigate]);

  return null;
};

export default SessionTimeoutHandler;



