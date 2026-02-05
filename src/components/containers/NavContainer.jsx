import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDisplay } from './displaySlice';
import { setLogin } from '../../loginSlice';
import { Menu, Avatar, Affix, Button } from 'antd';
import {
  ExperimentOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  UserOutlined,
  ToolOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  PaperClipOutlined,
  BellOutlined,
  HeartOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const { SubMenu } = Menu;

const StyledMenu = styled(Menu)`
  width: clamp(240px, 22vw, 320px);
  min-height: calc(100vh - 3rem);
  border-radius: 22px;
  padding: 1.25rem 0.75rem 1.5rem 0.75rem;
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 60px rgba(2, 8, 23, 0.5);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 1024px) {
    width: 100%;
    min-height: auto;
  }
`;

const Title = styled.h1`
  color: #e4e4e4;
  margin: 0.5rem 1rem 1.5rem 1rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  letter-spacing: 0.08rem;
`;

const SignOutButton = styled(Button)`
  background: rgba(255, 255, 255, 0.05);
  color: #9ad7ff;
  border: 1px solid rgba(154, 215, 255, 0.35);
  margin: 1.5rem 1rem 0 1rem;
  width: calc(100% - 2rem);
  border-radius: 999px;
  align-self: center;

  @media (max-width: 1024px) {
    width: calc(100% - 2rem);
  }
`;

const NavContainer = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  // Set state for current selection highlighting
  const [current, setCurrent] = useState(1);

  // Change display state depending on category button click
  const handleClick = (e) => {
    setCurrent(e.key);
    dispatch(setDisplay(e.key));
  };

  const handleSignOut = () => {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    dispatch(setLogin(false));
  };

  return (
    <>
      <Affix offsetTop={0}>
        <StyledMenu
          theme={'dark'}
          onClick={handleClick}
          // style={{ width: '20vw', height: '100vh', position: 'sticky' }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[current]}
          mode="inline">
          <Title
            onClick={() => {
              dispatch(setDisplay('default'));
            }}>
              <img src="https://6983befb32fdc2721e45d6ac.imgix.net/EPPL/Inventory/Logo_EPPL.jpeg" style={{ width: '200px', height: 'auto'}} alt="EPPL Logo" />
          </Title>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <SubMenu key="sub1" icon={<DatabaseOutlined />} title="Inventory">
            <Menu.Item key="consumables" icon={<PaperClipOutlined />}>
              Consumables
            </Menu.Item>
            <Menu.Item key="reagents" icon={<ExperimentOutlined />}>
              Reagents
            </Menu.Item>
            <Menu.Item key="cells" icon={<DeploymentUnitOutlined />}>
              Cell Lines
            </Menu.Item>
            <Menu.Item key="equipment" icon={<ToolOutlined />}>
              Equipment
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<ShoppingCartOutlined />} title="Order">
            <Menu.Item key="5">VWR</Menu.Item>
            <Menu.Item key="6">ThermoFisher</Menu.Item>
            <Menu.Item key="7">Barker Hall</Menu.Item>
          </SubMenu>
          <SubMenu icon={<UserOutlined />} key="sub4" title={currentUser}>
            <Menu.Item icon={<HeartOutlined />} key="favorites">
              Favorites
            </Menu.Item>
            <Menu.Item icon={<SettingOutlined />} key="10">
              Settings
            </Menu.Item>
            <Menu.Item icon={<BellOutlined />} key="11">
              Reminders
            </Menu.Item>
          </SubMenu>
          <SignOutButton href="/" shape="round" onClick={handleSignOut}>
            Sign out
          </SignOutButton>
        </StyledMenu>
      </Affix>
    </>
  );
};

export default NavContainer;
