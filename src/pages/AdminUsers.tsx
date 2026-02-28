import { useState } from 'react';
import { Users, Search, Edit2, Trash2, UserCheck, Shield, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface Citizen {
  id: string;
  name: string;
  email: string;
  phone: string;
  nid: string;
  verified: boolean;
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
}

const mockCitizens: Citizen[] = [
  {
    id: '1',
    name: 'Mohammad Rahim Uddin',
    email: 'rahim@example.com',
    phone: '+8801712345678',
    nid: '1234567890',
    verified: true,
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Fatima Begum Khan',
    email: 'fatima@example.com',
    phone: '+8801787654321',
    nid: '0987654321',
    verified: true,
    status: 'active',
    joinDate: '2024-01-10',
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+8801923456789',
    nid: '5555555555',
    verified: false,
    status: 'pending',
    joinDate: '2024-02-01',
  },
];

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

  const filteredCitizens = mockCitizens.filter((citizen) => {
    const matchesSearch =
      citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.nid.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || citizen.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Citizen['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      suspended: 'bg-red-100 text-red-700',
    };
    return styles[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-8 h-8 text-[rgb(var(--color-primary))]" />
          Citizen Management
        </h1>
        <p className="text-gray-600 mt-2">Manage registered citizens and verify identities</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or NID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-blue-600 font-medium">Total</p>
            <p className="text-lg font-bold text-blue-900">{mockCitizens.length}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-xs text-green-600 font-medium">Active</p>
            <p className="text-lg font-bold text-green-900">{mockCitizens.filter(c => c.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-xs text-amber-600 font-medium">Pending</p>
            <p className="text-lg font-bold text-amber-900">{mockCitizens.filter(c => c.status === 'pending').length}</p>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Citizen</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">NID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Verified</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitizens.map((citizen) => (
                <tr key={citizen.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{citizen.name}</p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" />
                        {citizen.email}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {citizen.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{citizen.nid}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {citizen.verified ? (
                        <>
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 text-amber-600" />
                          <span className="text-sm text-amber-600 font-medium">Unverified</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(citizen.status)}`}>
                      {citizen.status.charAt(0).toUpperCase() + citizen.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{citizen.joinDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCitizens.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No citizens found matching your filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
