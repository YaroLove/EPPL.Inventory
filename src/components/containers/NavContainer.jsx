import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDisplay } from './displaySlice';
import { setLogin } from '../../loginSlice';
import { Menu, Avatar, Affix, Button, Input, Modal, message } from 'antd';
import {
  ShoppingCartOutlined,
  SettingOutlined,
  UserOutlined,
  DatabaseOutlined,
  PaperClipOutlined,
  BellOutlined,
  HeartOutlined,
  DashboardOutlined,
  PlusOutlined,
  TagOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useGetCategoriesQuery, useAddCategoryMutation } from '../../services/categories';
import { useGetSuppliersQuery, useAddSupplierMutation } from '../../services/suppliers';

const { SubMenu } = Menu;

const StyledMenu = styled(Menu)`
  width: clamp(220px, 20vw, 280px);
  min-height: calc(100vh - 2.5rem);
  border-radius: 20px;
  padding: 1.25rem 0.75rem 1.5rem 0.75rem;
  background: linear-gradient(175deg, #1a5c3a 0%, #14532d 100%);
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  /* Menu items white text */
  .ant-menu-item,
  .ant-menu-submenu-title {
    color: rgba(255, 255, 255, 0.8) !important;
    border-radius: 12px !important;
    margin: 2px 0 !important;
    transition: background 0.15s ease, color 0.15s ease !important;
  }

  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.12) !important;
  }

  .ant-menu-item-selected {
    background: rgba(255, 255, 255, 0.18) !important;
    color: #ffffff !important;
    font-weight: 600 !important;
  }

  .ant-menu-item .anticon,
  .ant-menu-submenu-title .anticon {
    color: inherit !important;
  }

  .ant-menu-sub {
    background: transparent !important;
  }

  .ant-menu-sub .ant-menu-item {
    padding-left: 36px !important;
    font-size: 0.875rem !important;
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .ant-menu-sub .ant-menu-item:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }

  .ant-menu-sub .ant-menu-item-selected {
    background: rgba(255, 255, 255, 0.16) !important;
    color: #ffffff !important;
  }

  .ant-menu-submenu-arrow {
    color: rgba(255, 255, 255, 0.5) !important;
  }

  .ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow,
  .ant-menu-submenu-title:hover .ant-menu-submenu-arrow {
    color: rgba(255, 255, 255, 0.9) !important;
  }

  @media (max-width: 1024px) {
    width: 100%;
    min-height: auto;
  }
`;

const Title = styled.h1`
  color: #ffffff;
  margin: 0.5rem 0.75rem 1.5rem 0.75rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  letter-spacing: 0.04rem;
  cursor: pointer;
`;

const SignOutButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  margin: 1.5rem 0.75rem 0 0.75rem;
  width: calc(100% - 1.5rem);
  border-radius: 999px !important;
  align-self: center;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;

  &:hover {
    background: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    color: #ffffff !important;
  }

  @media (max-width: 1024px) {
    width: calc(100% - 1.5rem);
  }
`;

const AddButton = styled(Button)`
  margin: 0.25rem 0.5rem !important;
  width: calc(100% - 1rem) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px dashed rgba(255, 255, 255, 0.35) !important;
  color: rgba(255, 255, 255, 0.75) !important;
  border-radius: 8px !important;
  font-size: 0.8rem !important;
  transition: all 0.15s ease !important;

  &:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.55) !important;
  }
`;

const NavContainer = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  const [current, setCurrent] = useState('dashboard');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: suppliers = [] } = useGetSuppliersQuery();
  const [addCategory] = useAddCategoryMutation();
  const [addSupplier] = useAddSupplierMutation();

  const handleClick = (e) => {
    setCurrent(e.key);

    if (e.key === 'dashboard' || e.key === 'default' || e.key === 'favorites') {
      dispatch(setDisplay(e.key));
      return;
    }

    const matchedCategory = categories.find(c => c.name === e.key);
    if (matchedCategory) {
      dispatch(setDisplay({ type: 'category', value: matchedCategory.name }));
      return;
    }

    const matchedSupplier = suppliers.find(s => `supplier-${s.name}` === e.key);
    if (matchedSupplier) {
      dispatch(setDisplay({ type: 'supplier', value: matchedSupplier.name }));
      return;
    }
  };

  const handleAddCategory = async () => {
    if (!newName.trim()) return;
    try {
      await addCategory({ name: newName.trim() }).unwrap();
      message.success(`Category "${newName.trim()}" added`);
      setNewName('');
      setCategoryModalVisible(false);
    } catch (err) {
      message.error(err?.data?.error || 'Failed to add category');
    }
  };

  const handleAddSupplier = async () => {
    if (!newName.trim()) return;
    try {
      await addSupplier({ name: newName.trim() }).unwrap();
      message.success(`Supplier "${newName.trim()}" added`);
      setNewName('');
      setSupplierModalVisible(false);
    } catch (err) {
      message.error(err?.data?.error || 'Failed to add supplier');
    }
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
          defaultOpenKeys={['sub1', 'sub2']}
          selectedKeys={[current]}
          mode="inline">
          <Title
            onClick={() => {
              dispatch(setDisplay('default'));
            }}>
              <img src="https://6983befb32fdc2721e45d6ac.imgix.net/EPPL/Inventory/WhiteVersio_LogoMakr-300dpi.png" style={{ width: '200px', height: 'auto'}} alt="EPPL Logo" />
          </Title>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <SubMenu key="sub1" icon={<DatabaseOutlined />} title="Inventory">
            {categories.map((cat) => (
              <Menu.Item key={cat.name} icon={<PaperClipOutlined />}>
                {cat.name}
              </Menu.Item>
            ))}
            <AddButton
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              block
              onClick={(e) => {
                e.stopPropagation();
                setNewName('');
                setCategoryModalVisible(true);
              }}>
              Add Category
            </AddButton>
          </SubMenu>
          <SubMenu key="sub2" icon={<TagOutlined />} title="Supplier">
            {suppliers.map((sup) => (
              <Menu.Item key={`supplier-${sup.name}`} icon={<ShoppingCartOutlined />}>
                {sup.name}
              </Menu.Item>
            ))}
            <AddButton
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              block
              onClick={(e) => {
                e.stopPropagation();
                setNewName('');
                setSupplierModalVisible(true);
              }}>
              Add Supplier
            </AddButton>
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

      <Modal
        title="Add New Category"
        visible={categoryModalVisible}
        onOk={handleAddCategory}
        onCancel={() => setCategoryModalVisible(false)}
        okText="Add"
      >
        <Input
          placeholder="Category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onPressEnter={handleAddCategory}
          autoFocus
        />
      </Modal>

      <Modal
        title="Add New Supplier"
        visible={supplierModalVisible}
        onOk={handleAddSupplier}
        onCancel={() => setSupplierModalVisible(false)}
        okText="Add"
      >
        <Input
          placeholder="Supplier name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onPressEnter={handleAddSupplier}
          autoFocus
        />
      </Modal>
    </>
  );
};

export default NavContainer;
