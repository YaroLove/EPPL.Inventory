import React, { useState, useEffect } from 'react';
import {
  Form, Input, InputNumber, Radio, Button, Divider, Alert, message, Card, Typography,
} from 'antd';
import {
  LockOutlined, UserOutlined, SettingOutlined, TeamOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser, updateSettings } from '../../loginSlice';
import { useUpdateSettingsMutation, useUpdateProfileMutation } from '../../services/userApi';
import AdminUserPanel from '../admin/AdminUserPanel.jsx';

const { Title, Text } = Typography;

const PageWrapper = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
`;

const SectionCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: var(--radius-l) !important;
  box-shadow: var(--shadow-card) !important;
  border: 1px solid var(--border) !important;

  .ant-card-head {
    border-bottom: 1px solid var(--border);
    background: transparent;
  }
`;

const SaveBtn = styled(Button)`
  background: var(--brand-green) !important;
  border-color: var(--brand-green) !important;
  color: #fff !important;
  border-radius: 8px !important;
  &:hover { opacity: 0.88; }
`;

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { email, displayName, role, settings, tempPassword } = useSelector((s) => s.login);

  const [updateSettingsMutation] = useUpdateSettingsMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const [generalForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    generalForm.setFieldsValue({
      lowStockThreshold: settings.lowStockThreshold ?? 5,
      expirationWarningDays: settings.expirationWarningDays ?? 30,
      displayMode: settings.displayMode ?? 'cards',
    });
    profileForm.setFieldsValue({ displayName, email });
  }, [settings, email, displayName]);

  const handleSaveGeneral = async (values) => {
    try {
      const updated = await updateSettingsMutation(values).unwrap();
      dispatch(updateSettings(updated));
      message.success('Settings saved');
    } catch (err) {
      message.error(err?.data?.error || 'Failed to save settings');
    }
  };

  const handleSaveProfile = async (values) => {
    setProfileLoading(true);
    try {
      const updated = await updateProfile({
        displayName: values.displayName,
        email: values.email,
      }).unwrap();
      dispatch(setCurrentUser(updated));
      message.success('Profile updated');
    } catch (err) {
      message.error(err?.data?.error || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setPasswordLoading(true);
    try {
      await updateProfile({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      passwordForm.resetFields();
      message.success('Password changed successfully');
    } catch (err) {
      message.error(err?.data?.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Title level={3} style={{ marginBottom: '1.5rem', color: 'var(--text-1)' }}>
        <SettingOutlined style={{ marginRight: 8 }} />
        Settings
      </Title>

      {tempPassword && (
        <Alert
          message="You are using a temporary password. Please change it below."
          type="warning"
          showIcon
          style={{ marginBottom: '1.5rem' }}
        />
      )}

      {/* ── General Settings ─────────────────────────────── */}
      <SectionCard
        title={
          <Text strong style={{ color: 'var(--text-1)' }}>
            General
          </Text>
        }>
        <Form form={generalForm} layout="vertical" onFinish={handleSaveGeneral}>
          <Form.Item
            name="lowStockThreshold"
            label="Low Stock Threshold"
            tooltip="Items with quantity below this value will be flagged as low stock"
            rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="items" />
          </Form.Item>
          <Form.Item
            name="expirationWarningDays"
            label="Expiration Warning Lead Time"
            tooltip="Show warnings for items expiring within this many days"
            rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="days before expiry" />
          </Form.Item>
          <Form.Item name="displayMode" label="Default Display Mode">
            <Radio.Group>
              <Radio.Button value="cards">Cards</Radio.Button>
              <Radio.Button value="table">Table</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <SaveBtn htmlType="submit">Save General Settings</SaveBtn>
        </Form>
      </SectionCard>

      {/* ── Profile ──────────────────────────────────────── */}
      <SectionCard
        title={
          <Text strong style={{ color: 'var(--text-1)' }}>
            <UserOutlined style={{ marginRight: 6 }} />
            Profile
          </Text>
        }>
        <Form form={profileForm} layout="vertical" onFinish={handleSaveProfile}>
          <Form.Item
            name="displayName"
            label="Display Name"
            rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="Your name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true }, { type: 'email', message: 'Enter a valid email' }]}>
            <Input placeholder="your@email.com" />
          </Form.Item>
          <SaveBtn htmlType="submit" loading={profileLoading}>
            Save Profile
          </SaveBtn>
        </Form>

        <Divider />

        <Text strong style={{ color: 'var(--text-1)', display: 'block', marginBottom: 12 }}>
          <LockOutlined style={{ marginRight: 6 }} />
          Change Password
        </Text>
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Enter your current password' }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Enter a new password' },
              { min: 6, message: 'At least 6 characters' },
            ]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <SaveBtn htmlType="submit" loading={passwordLoading}>
            Change Password
          </SaveBtn>
        </Form>
      </SectionCard>

      {/* ── Admin Panel (admin only) ──────────────────────── */}
      {role === 'admin' && (
        <SectionCard
          title={
            <Text strong style={{ color: 'var(--text-1)' }}>
              <TeamOutlined style={{ marginRight: 6 }} />
              Admin — User Management
            </Text>
          }>
          <AdminUserPanel />
        </SectionCard>
      )}
    </PageWrapper>
  );
};

export default SettingsPage;
