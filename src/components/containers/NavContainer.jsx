import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDisplay } from './displaySlice';
import { clearCurrentUser } from '../../loginSlice';
import { Menu, Affix, Button, Input, Modal, Drawer, message } from 'antd';
import {
  ShoppingCartOutlined,
  SettingOutlined,
  UserOutlined,
  DatabaseOutlined,
  PaperClipOutlined,
  HeartOutlined,
  DashboardOutlined,
  PlusOutlined,
  TagOutlined,
  HistoryOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useGetCategoriesQuery, useAddCategoryMutation } from '../../services/categories';
import { useGetSuppliersQuery, useAddSupplierMutation } from '../../services/suppliers';
import useMediaQuery from '../../hooks/useMediaQuery';

const { SubMenu } = Menu;

const LOGO_URL =
  'https://res.cloudinary.com/dkftvbtmf/image/upload/v1774156055/Logo_eppl_snhgvc.jpg';

const StyledMenu = styled(Menu)`
  width: clamp(220px, 20vw, 280px);
  min-height: calc(100vh - 2.5rem);
  border-radius: 20px;
  padding: 1.25rem 0.75rem 1.5rem 0.75rem;
  background: linear-gradient(175deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #d1fae5;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  .ant-menu-item,
  .ant-menu-submenu-title {
    color: var(--text-1) !important;
    border-radius: 12px !important;
    margin: 2px 0 !important;
    transition: background 0.15s ease, color 0.15s ease !important;
  }

  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
    color: var(--brand-green) !important;
    background: rgba(22, 163, 74, 0.08) !important;
  }

  .ant-menu-item-selected {
    background: var(--brand-green) !important;
    color: #ffffff !important;
    font-weight: 600 !important;
  }

  .ant-menu-item-selected .anticon {
    color: #ffffff !important;
  }

  .ant-menu-item .anticon,
  .ant-menu-submenu-title .anticon {
    color: var(--text-2) !important;
  }

  .ant-menu-item:hover .anticon,
  .ant-menu-submenu-title:hover .anticon {
    color: var(--brand-green) !important;
  }

  .ant-menu-sub {
    background: transparent !important;
  }

  .ant-menu-sub .ant-menu-item {
    padding-left: 36px !important;
    font-size: 0.875rem !important;
    color: var(--text-2) !important;
  }

  .ant-menu-sub .ant-menu-item:hover {
    color: var(--brand-green) !important;
    background: rgba(22, 163, 74, 0.06) !important;
  }

  .ant-menu-sub .ant-menu-item-selected {
    background: var(--brand-green) !important;
    color: #ffffff !important;
  }

  .ant-menu-sub .ant-menu-item-selected .anticon {
    color: #ffffff !important;
  }

  .ant-menu-submenu-arrow {
    color: var(--text-3) !important;
  }

  .ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow,
  .ant-menu-submenu-title:hover .ant-menu-submenu-arrow {
    color: var(--brand-green) !important;
  }
`;

const DrawerMenu = styled(StyledMenu)`
  width: 100% !important;
  min-height: auto;
  border-radius: 0;
  border: none;
  box-shadow: none;
  padding: 0.5rem 0.25rem 1rem 0.25rem;
  background: transparent;
`;

const Title = styled.h1`
  color: var(--text-1);
  margin: 0.5rem 0.75rem 1.5rem 0.75rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  letter-spacing: 0.04rem;
  cursor: pointer;
`;

const SignOutButton = styled(Button)`
  background: transparent !important;
  color: var(--text-2) !important;
  border: 1px solid var(--border) !important;
  margin: 1.5rem 0.75rem 0 0.75rem;
  width: calc(100% - 1.5rem);
  border-radius: 999px !important;
  align-self: center;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;

  &:hover {
    background: #fef2f2 !important;
    border-color: var(--danger) !important;
    color: var(--danger) !important;
  }
`;

const AddButton = styled(Button)`
  margin: 0.25rem 0.5rem !important;
  width: calc(100% - 1rem) !important;
  background: rgba(22, 163, 74, 0.06) !important;
  border: 1px dashed #a7f3d0 !important;
  color: var(--brand-green) !important;
  border-radius: 8px !important;
  font-size: 0.8rem !important;
  transition: all 0.15s ease !important;

  &:hover {
    background: rgba(22, 163, 74, 0.12) !important;
    color: var(--brand-green-dark) !important;
    border-color: var(--brand-green) !important;
  }
`;

const MobileTopBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const HamburgerBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: var(--text-1);
  transition: background 0.15s;

  &:hover {
    background: var(--surface-hover);
  }
`;

const NavContainer = () => {
  const dispatch = useDispatch();
  const displayName = useSelector((state) => state.login.displayName);
  const isMobile = useMediaQuery(768);

  const [current, setCurrent] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: suppliers = [] } = useGetSuppliersQuery();
  const [addCategory] = useAddCategoryMutation();
  const [addSupplier] = useAddSupplierMutation();

  const handleClick = (e) => {
    setCurrent(e.key);

    if (['dashboard', 'default', 'favorites', 'settings', 'history'].includes(e.key)) {
      dispatch(setDisplay(e.key));
    } else {
      const matchedCategory = categories.find((c) => c.name === e.key);
      if (matchedCategory) {
        dispatch(setDisplay({ type: 'category', value: matchedCategory.name }));
      } else {
        const matchedSupplier = suppliers.find((s) => `supplier-${s.name}` === e.key);
        if (matchedSupplier) {
          dispatch(setDisplay({ type: 'supplier', value: matchedSupplier.name }));
        }
      }
    }

    if (isMobile) setDrawerOpen(false);
  };

  const handleLogoClick = () => {
    setCurrent('allitems');
    dispatch(setDisplay({ type: 'allitems', value: 'all' }));
    if (isMobile) setDrawerOpen(false);
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

  const handleSignOut = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
    } catch (_) {}
    dispatch(clearCurrentUser());
  };

  const menuContent = (MenuComponent) => (
    <MenuComponent
      theme="light"
      onClick={handleClick}
      defaultOpenKeys={['sub1', 'sub2']}
      selectedKeys={[current]}
      mode="inline">
      <Title onClick={handleLogoClick}>
        <img src={LOGO_URL} style={{ width: '180px', height: 'auto' }} alt="EPPL Logo" />
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
      <Menu.Item key="history" icon={<HistoryOutlined />}>
        History
      </Menu.Item>
      <SubMenu icon={<UserOutlined />} key="sub4" title={displayName || 'Account'}>
        <Menu.Item icon={<HeartOutlined />} key="favorites">
          Favorites
        </Menu.Item>
        <Menu.Item icon={<SettingOutlined />} key="settings">
          Settings
        </Menu.Item>
      </SubMenu>
      <SignOutButton shape="round" onClick={handleSignOut}>
        Sign out
      </SignOutButton>
    </MenuComponent>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileTopBar>
            <HamburgerBtn onClick={() => setDrawerOpen(true)}>
              <MenuOutlined />
            </HamburgerBtn>
            <img
              src={LOGO_URL}
              style={{ height: '32px', width: 'auto', cursor: 'pointer' }}
              alt="EPPL Logo"
              onClick={handleLogoClick}
            />
            <div style={{ width: 40 }} />
          </MobileTopBar>
          <Drawer
            placement="left"
            visible={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            width={280}
            bodyStyle={{ padding: 0, background: 'linear-gradient(175deg, #f0fdf4 0%, #dcfce7 100%)' }}
            headerStyle={{ display: 'none' }}
            closable={false}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
              <HamburgerBtn onClick={() => setDrawerOpen(false)}>
                <CloseOutlined />
              </HamburgerBtn>
            </div>
            {menuContent(DrawerMenu)}
          </Drawer>
        </>
      ) : (
        <Affix offsetTop={0}>{menuContent(StyledMenu)}</Affix>
      )}

      <Modal
        title="Add New Category"
        visible={categoryModalVisible}
        onOk={handleAddCategory}
        onCancel={() => setCategoryModalVisible(false)}
        okText="Add">
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
        okText="Add">
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
