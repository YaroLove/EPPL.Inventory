import React, { useEffect } from 'react';

import 'antd/dist/antd.css';
import './index.css';
import NavContainer from './components/containers/NavContainer.jsx';
import ItemsContainer from './components/containers/ItemsContainer.jsx';
import LoginContainer from './components/containers/LoginContainer.jsx';
import AIAssistant from './components/AI/AIAssistant.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from './loginSlice';

function App() {
  const isLoggedIn = useSelector((state) => state.login.loggedIn);
  const dispatch = useDispatch();

  // Restore session on page load
  useEffect(() => {
    fetch('/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((user) => {
        if (user) dispatch(setCurrentUser(user));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="App">
      {!isLoggedIn && <LoginContainer />}
      {isLoggedIn && <NavContainer />}
      {isLoggedIn && <ItemsContainer />}
      {isLoggedIn && <AIAssistant />}
    </div>
  );
}

export default App;
