import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Tag, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation } from '../../services/adminApi';

const AdminUserPanel = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createUser(values).unwrap();
      message.success(`User ${values.email} created successfully`);
      form.resetFields();
      setModalVisible(false);
    } catch (err) {
      message.error(err?.data?.error || 'Failed to create user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      message.success('User deleted');
    } catch (err) {
      message.error(err?.data?.error || 'Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <UserOutlined style={{ color: 'var(--text-3)' }} />
          {email}
        </Space>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'green' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'tempPassword',
      key: 'tempPassword',
      render: (temp) => temp ? <Tag color="orange">Temp Password</Tag> : <Tag color="green">Active</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) =>
        record.role !== 'admin' ? (
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            okType="danger">
            <Button type="text" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        ) : (
          <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>Protected</span>
        ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: 'var(--text-1)' }}>User Management</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{ background: 'var(--brand-green)', borderColor: 'var(--brand-green)' }}>
          Add User
        </Button>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        size="small"
        pagination={false}
        style={{ marginTop: 8 }}
      />

      <Modal
        title="Add New User"
        visible={modalVisible}
        onOk={handleCreate}
        onCancel={() => { setModalVisible(false); form.resetFields(); }}
        okText="Create User"
        okButtonProps={{ style: { background: 'var(--brand-green)', borderColor: 'var(--brand-green)' } }}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}>
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item name="displayName" label="Display Name">
            <Input placeholder="Full name (optional)" />
          </Form.Item>
          <Form.Item
            name="tempPassword"
            label="Temporary Password"
            rules={[
              { required: true, message: 'Temporary password is required' },
              { min: 6, message: 'At least 6 characters' },
            ]}>
            <Input.Password placeholder="Temporary password for first login" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserPanel;
