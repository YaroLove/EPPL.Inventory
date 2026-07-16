import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDisplay } from './displaySlice';
import { clearCurrentUser } from '../../loginSlice';
import { Menu, Affix, Button, Input, Modal, Drawer, Dropdown, Select, message } from 'antd';
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
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../services/categories';
import {
  useGetSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from '../../services/suppliers';
import { useGetAllItemsQuery } from '../../services/items';
import useMediaQuery from '../../hooks/useMediaQuery';

const { SubMenu } = Menu;

const LOGO_URL =
  'https://res.cloudinary.com/dkftvbtmf/image/upload/v1774156055/Logo_eppl_snhgvc.jpg';

const StyledMenu = styled(Menu)`
  width: clamp(220px, 20vw, 280px);
  min-height: calc(100vh - 2.5rem);
  max-height: calc(100vh - 2.5rem);
  overflow-y: auto;
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

const NavItemLabel = styled.span`
  display: block;
  width: 100%;
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

function contextMenuOverlay(onEdit, onDelete) {
  return (
    <Menu
      onClick={({ key, domEvent }) => {
        domEvent.stopPropagation();
        if (key === 'edit') onEdit();
        if (key === 'delete') onDelete();
      }}>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Delete
      </Menu.Item>
    </Menu>
  );
}

function wrapNavLabel(name, onEdit, onDelete) {
  return (
    <Dropdown overlay={contextMenuOverlay(onEdit, onDelete)} trigger={['contextMenu']}>
      <NavItemLabel>{name}</NavItemLabel>
    </Dropdown>
  );
}

const NavContainer = () => {
  const dispatch = useDispatch();
  const displayName = useSelector((state) => state.login.displayName);
  const display = useSelector((state) => state.display.display);
  const isMobile = useMediaQuery(768);

  const [current, setCurrent] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reassignTo, setReassignTo] = useState('');
  const [newName, setNewName] = useState('');

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: suppliers = [] } = useGetSuppliersQuery();
  const { data: allItems = [] } = useGetAllItemsQuery();
  const [addCategory] = useAddCategoryMutation();
  const [addSupplier] = useAddSupplierMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const displayType = display?.type || 'page';
  const displayValue = display?.value || display;

  const redirectIfViewingDeleted = (kind, deletedName) => {
    if (kind === 'category' && displayType === 'category' && displayValue === deletedName) {
      dispatch(setDisplay('dashboard'));
      setCurrent('dashboard');
    }
    if (kind === 'supplier' && displayType === 'supplier' && displayValue === deletedName) {
      dispatch(setDisplay('dashboard'));
      setCurrent('dashboard');
    }
  };

  const redirectIfViewingRenamed = (kind, oldName, newName) => {
    if (kind === 'category' && displayType === 'category' && displayValue === oldName) {
      dispatch(setDisplay({ type: 'category', value: newName }));
      setCurrent(newName);
    }
    if (kind === 'supplier' && displayType === 'supplier' && displayValue === oldName) {
      dispatch(setDisplay({ type: 'supplier', value: newName }));
      setCurrent(`supplier-${newName}`);
    }
  };

  const countItemsForCategory = (name) =>
    allItems.filter((i) => i.category === name).length;

  const countItemsForSupplier = (name) =>
    allItems.filter((i) => i.supplier === name).length;

  const openEditCategory = (cat) => {
    setEditTarget({ kind: 'category', record: cat });
    setNewName(cat.name);
  };

  const openEditSupplier = (sup) => {
    setEditTarget({ kind: 'supplier', record: sup });
    setNewName(sup.name);
  };

  const startDeleteCategory = (cat) => {
    const itemCount = countItemsForCategory(cat.name);
    if (itemCount === 0) {
      Modal.confirm({
        title: `Delete category "${cat.name}"?`,
        okText: 'Delete',
        okType: 'danger',
        onOk: () => performDeleteCategory(cat, null),
      });
      return;
    }
    setReassignTo('');
    setDeleteTarget({ kind: 'category', record: cat, itemCount });
  };

  const startDeleteSupplier = (sup) => {
    const itemCount = countItemsForSupplier(sup.name);
    if (itemCount === 0) {
      Modal.confirm({
        title: `Delete supplier "${sup.name}"?`,
        okText: 'Delete',
        okType: 'danger',
        onOk: () => performDeleteSupplier(sup, null),
      });
      return;
    }
    setReassignTo('');
    setDeleteTarget({ kind: 'supplier', record: sup, itemCount });
  };

  const performDeleteCategory = async (cat, reassign) => {
    try {
      await deleteCategory({ id: cat._id, reassignTo: reassign || undefined }).unwrap();
      message.success(`Category "${cat.name}" deleted`);
      redirectIfViewingDeleted('category', cat.name);
      setDeleteTarget(null);
      setReassignTo('');
    } catch (err) {
      message.error(err?.data?.error || 'Failed to delete category');
    }
  };

  const performDeleteSupplier = async (sup, reassign) => {
    try {
      await deleteSupplier({ id: sup._id, reassignTo: reassign || undefined }).unwrap();
      message.success(`Supplier "${sup.name}" deleted`);
      redirectIfViewingDeleted('supplier', sup.name);
      setDeleteTarget(null);
      setReassignTo('');
    } catch (err) {
      message.error(err?.data?.error || 'Failed to delete supplier');
    }
  };

  const handleSaveEdit = async () => {
    if (!editTarget || !newName.trim()) return;
    const trimmed = newName.trim();
    try {
      if (editTarget.kind === 'category') {
        const oldName = editTarget.record.name;
        await updateCategory({ id: editTarget.record._id, name: trimmed }).unwrap();
        message.success(`Category renamed to "${trimmed}"`);
        redirectIfViewingRenamed('category', oldName, trimmed);
      } else {
        const oldName = editTarget.record.name;
        await updateSupplier({ id: editTarget.record._id, name: trimmed }).unwrap();
        message.success(`Supplier renamed to "${trimmed}"`);
        redirectIfViewingRenamed('supplier', oldName, trimmed);
      }
      setEditTarget(null);
      setNewName('');
    } catch (err) {
      message.error(err?.data?.error || 'Failed to update');
    }
  };

  const handleConfirmReassignDelete = async () => {
    if (!deleteTarget || !reassignTo) {
      message.warning('Please select where to reassign items');
      return;
    }
    if (deleteTarget.kind === 'category') {
      await performDeleteCategory(deleteTarget.record, reassignTo);
    } else {
      await performDeleteSupplier(deleteTarget.record, reassignTo);
    }
  };

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
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {}
    dispatch(clearCurrentUser());
  };

  const menuContent = (MenuComponent) => (
    <MenuComponent
      theme="light"
          onClick={handleClick}
      defaultOpenKeys={[]}
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
            {wrapNavLabel(cat.name, () => openEditCategory(cat), () => startDeleteCategory(cat))}
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
            {wrapNavLabel(sup.name, () => openEditSupplier(sup), () => startDeleteSupplier(sup))}
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

      <Modal
        title={
          editTarget?.kind === 'category' ? 'Edit Category' : editTarget ? 'Edit Supplier' : ''
        }
        visible={!!editTarget}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditTarget(null);
          setNewName('');
        }}
        okText="Save">
        <Input
          placeholder={editTarget?.kind === 'category' ? 'Category name' : 'Supplier name'}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onPressEnter={handleSaveEdit}
          autoFocus
        />
      </Modal>

      <Modal
        title={
          deleteTarget?.kind === 'category' ? 'Delete Category' : 'Delete Supplier'
        }
        visible={!!deleteTarget}
        onOk={handleConfirmReassignDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setReassignTo('');
        }}
        okText="Delete and reassign"
        okType="danger">
        <p style={{ marginBottom: 12, color: 'var(--text-2)' }}>
          {deleteTarget?.itemCount} item(s) use &quot;{deleteTarget?.record?.name}&quot;. Reassign
          them to:
        </p>
        <Select
          style={{ width: '100%' }}
          placeholder={
            deleteTarget?.kind === 'category' ? 'Select category' : 'Select supplier'
          }
          value={reassignTo || undefined}
          onChange={setReassignTo}
          showSearch
          optionFilterProp="children">
          {deleteTarget?.kind === 'category'
            ? categories
                .filter((c) => c.name !== deleteTarget?.record?.name)
                .map((c) => (
                  <Select.Option key={c._id} value={c.name}>
                    {c.name}
                  </Select.Option>
                ))
            : suppliers
                .filter((s) => s.name !== deleteTarget?.record?.name)
                .map((s) => (
                  <Select.Option key={s._id} value={s.name}>
                    {s.name}
                  </Select.Option>
                ))}
        </Select>
      </Modal>
    </>
  );
};

export default NavContainer;
