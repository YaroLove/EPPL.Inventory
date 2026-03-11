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

const AddButton = styled(Button)`
  margin: 0.25rem 0.75rem;
  border-style: dashed;
  opacity: 0.7;
  &:hover {
    opacity: 1;
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
