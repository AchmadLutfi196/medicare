'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText,
  Settings,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { runSeeder } from '../../../scripts/seeder';

export default function DatabasePage() {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRunSeeder = async () => {
    setSeeding(true);
    setSeedResult(null);
    
    try {
      await runSeeder();
      setSeedResult({ success: true, message: 'Database seeding completed successfully!' });
    } catch (error) {
      setSeedResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Seeding failed' 
      });
    } finally {
      setSeeding(false);
    }
  };

  const sections = [
    {
      title: 'Database Seeding',
      description: 'Initialize database with sample data',
      icon: Database,
      color: 'bg-blue-500'
    },
    {
      title: 'Doctors Management',
      description: 'Manage doctor profiles and schedules',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Appointments',
      description: 'View and manage patient appointments',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Testimonials',
      description: 'Moderate patient reviews and feedback',
      icon: MessageSquare,
      color: 'bg-orange-500'
    },
    {
      title: 'Content Management',
      description: 'Manage articles, FAQs, and hospital info',
      icon: FileText,
      color: 'bg-teal-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: Settings,
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Management</h1>
        <p className="text-gray-600">Manage hospital database and system data</p>
      </div>

      {/* Database Seeding Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Initialize Database</h2>
            <p className="text-gray-600">Populate the database with sample doctors, facilities, and hospital information</p>
          </div>
          <Database className="w-12 h-12 text-blue-500" />
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800 text-sm">
                <strong>Warning:</strong> This will add sample data to your database. Make sure this is what you want to do.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunSeeder}
            disabled={seeding}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              seeding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {seeding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Seeding Database...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Run Database Seeder</span>
              </>
            )}
          </button>

          {seedResult && (
            <div className={`border rounded-lg p-4 ${
              seedResult.success 
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                {seedResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <p className={`text-sm ${
                  seedResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {seedResult.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${section.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{section.description}</p>
              
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors">
                Manage
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Database Overview</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
            <div className="text-gray-600">Doctors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="text-gray-600">Appointments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-gray-600">Testimonials</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
            <div className="text-gray-600">Facilities</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
        
        <div className="space-y-3 text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
            <div>
              <p className="font-semibold">Run Database Seeder</p>
              <p className="text-sm text-gray-600">Initialize your database with sample doctors, facilities, and hospital information.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
            <div>
              <p className="font-semibold">Test Booking System</p>
              <p className="text-sm text-gray-600">Go to the booking page and test the appointment system with the seeded doctors.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
            <div>
              <p className="font-semibold">Manage Data</p>
              <p className="text-sm text-gray-600">Use the management sections above to add, edit, or remove data as needed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
