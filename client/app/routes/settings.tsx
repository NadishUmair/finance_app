import React from 'react';
import { Settings, User, Building2, Bell, Shield, Palette } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function SettingsPage() {
  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      color: 'text-blue-600'
    },
    {
      icon: Building2,
      title: 'Organization',
      description: 'Configure your organization settings and team members',
      color: 'text-green-600'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Customize your notification preferences',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Manage passwords, 2FA, and security settings',
      color: 'text-red-600'
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel of your dashboard',
      color: 'text-purple-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your account and application preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg bg-gray-50 mr-4`}>
                    <Icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{section.title}</h3>
                    <p className="text-gray-500 text-sm">{section.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-gray-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
          </div>
          <p className="text-gray-500 mb-6">Advanced configuration options for power users.</p>
          <p className="text-sm text-gray-400">Coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}