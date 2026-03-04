import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Settings,
  Filter,
  Trash2,
  Eye
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'application' | 'document' | 'reminder' | 'system';
  priority: 'high' | 'medium' | 'low';
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
}

export function Notifications() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'unread' | 'application' | 'document' | 'reminder'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'application',
      priority: 'high',
      titleBn: 'পাসপোর্ট আবেদন অনুমোদিত',
      titleEn: 'Passport Application Approved',
      messageBn: 'আপনার পাসপোর্ট আবেদন (APP-2024-1234) অনুমোদিত হয়েছে। পাসপোর্ট সংগ্রহ করুন।',
      messageEn: 'Your passport application (APP-2024-1234) has been approved. Please collect your passport.',
      timestamp: '2024-03-01T10:30:00',
      read: false,
      actionable: true
    },
    {
      id: '2',
      type: 'reminder',
      priority: 'medium',
      titleBn: 'নথি মেয়াদ শেষ হবে',
      titleEn: 'Document Expiry Reminder',
      messageBn: 'আপনার পুলিশ ক্লিয়ারেন্স সার্টিফিকেট ৭ দিনের মধ্যে মেয়াদ শেষ হবে।',
      messageEn: 'Your Police Clearance Certificate will expire in 7 days.',
      timestamp: '2024-02-29T15:20:00',
      read: false,
      actionable: true
    },
    {
      id: '3',
      type: 'document',
      priority: 'low',
      titleBn: 'নতুন নথি যোগ হয়েছে',
      titleEn: 'New Document Added',
      messageBn: 'আপনার ডিজিটাল ওয়ালেটে জন্ম সনদ যোগ করা হয়েছে।',
      messageEn: 'Birth Certificate has been added to your digital wallet.',
      timestamp: '2024-02-28T09:15:00',
      read: true,
      actionable: false
    },
    {
      id: '4',
      type: 'application',
      priority: 'medium',
      titleBn: 'আবেদন প্রক্রিয়াধীন',
      titleEn: 'Application Under Processing',
      messageBn: 'আপনার NID সংশোধন আবেদন (APP-2024-5678) প্রক্রিয়াধীন আছে।',
      messageEn: 'Your NID correction application (APP-2024-5678) is under processing.',
      timestamp: '2024-02-27T14:45:00',
      read: true,
      actionable: false
    },
    {
      id: '5',
      type: 'system',
      priority: 'high',
      titleBn: 'পরিচয় যাচাইকরণ প্রয়োজন',
      titleEn: 'Identity Verification Required',
      messageBn: 'আপনার অ্যাকাউন্ট সুরক্ষার জন্য পুনরায় পরিচয় যাচাই করুন।',
      messageEn: 'Please re-verify your identity for account security.',
      timestamp: '2024-02-26T11:00:00',
      read: false,
      actionable: true
    },
    {
      id: '6',
      type: 'reminder',
      priority: 'low',
      titleBn: 'সেবা সম্পর্কে জানুন',
      titleEn: 'Learn About Services',
      messageBn: 'হজ্জ ও উমরাহ সেবা সম্পর্কে বিস্তারিত জানতে ক্লিক করুন।',
      messageEn: 'Click to learn more about Hajj & Umrah services.',
      timestamp: '2024-02-25T16:30:00',
      read: true,
      actionable: true
    }
  ]);

  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    push: true,
    applicationUpdates: true,
    documentReminders: true,
    systemNotifications: true
  });

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-600';
      case 'medium': return 'from-orange-500 to-yellow-600';
      case 'low': return 'from-blue-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application': return FileText;
      case 'document': return FileText;
      case 'reminder': return Calendar;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('বিজ্ঞপ্তি', 'Notifications')}
              </h1>
              <p className={`text-lg text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {unreadCount > 0 && (
                  <span className="text-[rgb(var(--color-primary))]">
                    {unreadCount} {t('টি অপঠিত', 'unread')}
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={`px-4 py-2 rounded-xl bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-hover))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${language === 'bn' ? 'font-bangla' : ''}`}
            >
              {t('সব পড়া হয়েছে চিহ্নিত করুন', 'Mark All as Read')}
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', labelBn: 'সকল', labelEn: 'All' },
            { id: 'unread', labelBn: 'অপঠিত', labelEn: 'Unread' },
            { id: 'application', labelBn: 'আবেদন', labelEn: 'Applications' },
            { id: 'document', labelBn: 'নথি', labelEn: 'Documents' },
            { id: 'reminder', labelBn: 'রিমাইন্ডার', labelEn: 'Reminders' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-[rgb(var(--color-primary))] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              } ${language === 'bn' ? 'font-bangla' : ''}`}
            >
              {t(f.labelBn, f.labelEn)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4 mb-8">
          {filteredNotifications.map((notif, index) => {
            const Icon = getTypeIcon(notif.type);
            
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer ${
                  notif.read 
                    ? 'border-gray-200' 
                    : 'border-[rgb(var(--color-accent))] bg-[rgb(var(--color-accent-light))]'
                }`}
                style={{ boxShadow: 'var(--shadow-md)' }}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPriorityColor(notif.priority)} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-lg mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {language === 'bn' ? notif.titleBn : notif.titleEn}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notif.timestamp)}
                      </span>
                    </div>
                    
                    <p className={`text-[rgb(var(--color-text-secondary))] mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {language === 'bn' ? notif.messageBn : notif.messageEn}
                    </p>

                    <div className="flex items-center gap-2">
                      {notif.actionable && (
                        <button className={`px-4 py-2 rounded-lg bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-hover))] transition-colors text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t('বিস্তারিত দেখুন', 'View Details')}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-200"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            <h3 className={`text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('বিজ্ঞপ্তি সেটিংস', 'Notification Preferences')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-200">
              <h4 className={`text-sm font-medium mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('বিজ্ঞপ্তি চ্যানেল', 'Notification Channels')}
              </h4>
              
              <div className="space-y-3">
                {[
                  { key: 'email', icon: Mail, labelBn: 'ইমেইল', labelEn: 'Email' },
                  { key: 'sms', icon: Smartphone, labelBn: 'SMS', labelEn: 'SMS' },
                  { key: 'push', icon: Bell, labelBn: 'পুশ নোটিফিকেশন', labelEn: 'Push Notifications' }
                ].map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div key={channel.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-400" />
                        <span className={language === 'bn' ? 'font-bangla' : ''}>
                          {t(channel.labelBn, channel.labelEn)}
                        </span>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, [channel.key]: !preferences[channel.key as keyof typeof preferences] })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          preferences[channel.key as keyof typeof preferences]
                            ? 'bg-[rgb(var(--color-primary))]'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences[channel.key as keyof typeof preferences]
                            ? 'translate-x-6'
                            : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-medium mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('বিজ্ঞপ্তি প্রকার', 'Notification Types')}
              </h4>
              
              <div className="space-y-3">
                {[
                  { key: 'applicationUpdates', labelBn: 'আবেদন আপডেট', labelEn: 'Application Updates' },
                  { key: 'documentReminders', labelBn: 'নথি রিমাইন্ডার', labelEn: 'Document Reminders' },
                  { key: 'systemNotifications', labelBn: 'সিস্টেম নোটিফিকেশন', labelEn: 'System Notifications' }
                ].map((type) => (
                  <div key={type.key} className="flex items-center justify-between">
                    <span className={language === 'bn' ? 'font-bangla' : ''}>
                      {t(type.labelBn, type.labelEn)}
                    </span>
                    <button
                      onClick={() => setPreferences({ ...preferences, [type.key]: !preferences[type.key as keyof typeof preferences] })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences[type.key as keyof typeof preferences]
                          ? 'bg-[rgb(var(--color-primary))]'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences[type.key as keyof typeof preferences]
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
