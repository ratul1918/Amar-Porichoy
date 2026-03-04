import { 
  FileText, CreditCard, BookOpen, Vote, Users, Building, ArrowRight, 
  Home, GraduationCap, Heart, Car, Briefcase, Shield, Plane, 
  DollarSign, Scale, Landmark, TrendingUp, Globe, Award, 
  Clipboard, MapPin, Phone, UserCheck, Baby, Receipt,
  BriefcaseBusiness, TreePine, Droplet, Zap, Wifi,
  Wheat, FileCheck, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useState } from 'react';

export function Services() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services = [
    // Identity & Civil Registration (8)
    {
      id: 'birth-certificate',
      icon: Baby,
      titleBn: 'জন্ম নিবন্ধন',
      titleEn: 'Birth Registration',
      descBn: 'জন্ম নিবন্ধনের তথ্য সংশোধন ও হালনাগাদ করুন',
      descEn: 'Register or correct birth information',
      color: 'from-blue-500 to-cyan-500',
      category: 'identity'
    },
    {
      id: 'nid-registration',
      icon: CreditCard,
      titleBn: 'জাতীয় পরিচয়পত্র',
      titleEn: 'National ID Card',
      descBn: 'নতুন জাতীয় পরিচয়পত্রের জন্য আবেদন করুন',
      descEn: 'Apply for new or renewed National ID',
      color: 'from-green-500 to-emerald-500',
      category: 'identity'
    },
    {
      id: 'e-passport',
      icon: Plane,
      titleBn: 'ই-পাসপোর্ট',
      titleEn: 'e-Passport',
      descBn: 'নতুন ই-পাসপোর্টের জন্য আবেদন করুন',
      descEn: 'Apply for new e-Passport',
      color: 'from-purple-500 to-pink-500',
      category: 'identity'
    },
    {
      id: 'voter-list',
      icon: Vote,
      titleBn: 'ভোটার তালিকা',
      titleEn: 'Voter Registration',
      descBn: 'ভোটার তালিকায় নাম যুক্ত বা সংশোধন করুন',
      descEn: 'Register or update voter information',
      color: 'from-orange-500 to-red-500',
      category: 'identity'
    },
    {
      id: 'death-certificate',
      icon: FileText,
      titleBn: 'মৃত্যু সনদ',
      titleEn: 'Death Certificate',
      descBn: 'মৃত্যু সনদপত্রের জন্য আবেদন',
      descEn: 'Apply for death certificate',
      color: 'from-gray-500 to-slate-500',
      category: 'identity'
    },
    {
      id: 'marriage-certificate',
      icon: Heart,
      titleBn: 'বিবাহ সনদ',
      titleEn: 'Marriage Certificate',
      descBn: 'বিবাহ নিবন্ধন সনদপত্র',
      descEn: 'Marriage registration certificate',
      color: 'from-pink-500 to-rose-500',
      category: 'identity'
    },
    {
      id: 'divorce-certificate',
      icon: FileCheck,
      titleBn: 'তালাক সনদ',
      titleEn: 'Divorce Certificate',
      descBn: 'তালাক সনদপত্রের জন্য আবেদন',
      descEn: 'Apply for divorce certificate',
      color: 'from-red-500 to-orange-500',
      category: 'identity'
    },
    {
      id: 'family-certificate',
      icon: Users,
      titleBn: 'পরিবার সনদপত্র',
      titleEn: 'Family Certificate',
      descBn: 'পরিবারের সদস্যদের তথ্য সনদপত্র',
      descEn: 'Family members information certificate',
      color: 'from-teal-500 to-cyan-500',
      category: 'identity'
    },

    // Education (10)
    {
      id: 'ssc-certificate',
      icon: GraduationCap,
      titleBn: 'এসএসসি সনদপত্র',
      titleEn: 'SSC Certificate',
      descBn: 'এসএসসি পরীক্ষার সনদপত্র যাচাই',
      descEn: 'SSC examination certificate verification',
      color: 'from-blue-600 to-indigo-600',
      category: 'education'
    },
    {
      id: 'hsc-certificate',
      icon: GraduationCap,
      titleBn: 'এইচএসসি সনদপত্র',
      titleEn: 'HSC Certificate',
      descBn: 'এইচএসসি পরীক্ষার সনদপত্র যাচাই',
      descEn: 'HSC examination certificate verification',
      color: 'from-indigo-600 to-purple-600',
      category: 'education'
    },
    {
      id: 'degree-certificate',
      icon: Award,
      titleBn: 'স্নাতক সনদপত্র',
      titleEn: 'Degree Certificate',
      descBn: 'স্নাতক ডিগ্রি সনদপত্র যাচাই',
      descEn: 'Bachelor degree certificate verification',
      color: 'from-purple-600 to-pink-600',
      category: 'education'
    },
    {
      id: 'masters-certificate',
      icon: Award,
      titleBn: 'স্নাতকোত্তর সনদপত্র',
      titleEn: 'Masters Certificate',
      descBn: 'স্নাতকোত্তর সনদপত্র যাচাই',
      descEn: 'Masters degree certificate verification',
      color: 'from-pink-600 to-rose-600',
      category: 'education'
    },
    {
      id: 'phd-certificate',
      icon: Award,
      titleBn: 'পিএইচডি সনদপত্র',
      titleEn: 'PhD Certificate',
      descBn: 'পিএইচডি সনদপত্র যাচাই',
      descEn: 'PhD certificate verification',
      color: 'from-violet-600 to-purple-600',
      category: 'education'
    },
    {
      id: 'school-admission',
      icon: GraduationCap,
      titleBn: 'স্কুলে ভর্তি',
      titleEn: 'School Admission',
      descBn: 'সরকারি স্কুলে ভর্তির আবেদন',
      descEn: 'Apply for government school admission',
      color: 'from-cyan-500 to-blue-500',
      category: 'education'
    },
    {
      id: 'college-admission',
      icon: BookOpen,
      titleBn: 'কলেজে ভর্তি',
      titleEn: 'College Admission',
      descBn: 'সরকারি কলেজে ভর্তির আবেদন',
      descEn: 'Apply for government college admission',
      color: 'from-blue-500 to-indigo-500',
      category: 'education'
    },
    {
      id: 'scholarship',
      icon: Award,
      titleBn: 'বৃত্তি',
      titleEn: 'Scholarship',
      descBn: 'সরকারি বৃত্তির জন্য আবেদন',
      descEn: 'Apply for government scholarship',
      color: 'from-yellow-500 to-orange-500',
      category: 'education'
    },
    {
      id: 'education-loan',
      icon: DollarSign,
      titleBn: 'শিক্ষা ঋণ',
      titleEn: 'Education Loan',
      descBn: 'শিক্ষা ঋণের জন্য আবেদন',
      descEn: 'Apply for education loan',
      color: 'from-green-600 to-teal-600',
      category: 'education'
    },
    {
      id: 'transcript',
      icon: FileText,
      titleBn: 'ট্রান্সক্রিপ্ট',
      titleEn: 'Academic Transcript',
      descBn: 'শিক্ষাগত ট্রান্সক্রিপ্ট সনদ',
      descEn: 'Academic transcript certificate',
      color: 'from-teal-600 to-cyan-600',
      category: 'education'
    },

    // Financial & Tax (8)
    {
      id: 'tax-certificate',
      icon: Receipt,
      titleBn: 'কর সনদপত্র',
      titleEn: 'Tax Certificate',
      descBn: 'করদাতা সনদপত্রের জন্য আবেদন',
      descEn: 'Apply for tax certificate',
      color: 'from-indigo-500 to-blue-500',
      category: 'financial'
    },
    {
      id: 'tin-registration',
      icon: DollarSign,
      titleBn: 'টিআইএন নিবন্ধন',
      titleEn: 'TIN Registration',
      descBn: 'করদাতা শনাক্তকরণ নম্বর নিবন্ধন',
      descEn: 'Taxpayer Identification Number registration',
      color: 'from-green-600 to-emerald-600',
      category: 'financial'
    },
    {
      id: 'vat-registration',
      icon: TrendingUp,
      titleBn: 'ভ্যাট নিবন্ধন',
      titleEn: 'VAT Registration',
      descBn: 'মূল্য সংযোজন কর নিবন্ধন',
      descEn: 'Value Added Tax registration',
      color: 'from-blue-600 to-indigo-600',
      category: 'financial'
    },
    {
      id: 'income-certificate',
      icon: DollarSign,
      titleBn: 'আয়ের সনদপত্র',
      titleEn: 'Income Certificate',
      descBn: 'আয়ের সনদপত্রের জন্য আবেদন',
      descEn: 'Apply for income certificate',
      color: 'from-emerald-600 to-green-600',
      category: 'financial'
    },
    {
      id: 'bank-account-opening',
      icon: Landmark,
      titleBn: 'ব্যাংক অ্যাকাউন্ট',
      titleEn: 'Bank Account Opening',
      descBn: 'সরকারি ব্যাংকে অ্যাকাউন্ট খোলা',
      descEn: 'Open account in government bank',
      color: 'from-purple-600 to-pink-600',
      category: 'financial'
    },
    {
      id: 'pension',
      icon: Users,
      titleBn: 'পেনশন',
      titleEn: 'Pension',
      descBn: 'সরকারি পেনশনের জন্য আবেদন',
      descEn: 'Apply for government pension',
      color: 'from-orange-600 to-red-600',
      category: 'financial'
    },
    {
      id: 'social-welfare',
      icon: Heart,
      titleBn: 'সামাজিক নিরাপত্তা ভাতা',
      titleEn: 'Social Welfare',
      descBn: 'সামাজিক নিরাপত্তা ভাতার জন্য আবেদন',
      descEn: 'Apply for social welfare allowance',
      color: 'from-pink-600 to-rose-600',
      category: 'financial'
    },
    {
      id: 'subsidy',
      icon: TrendingUp,
      titleBn: 'ভর্তুকি',
      titleEn: 'Government Subsidy',
      descBn: 'সরকারি ভর্তুকির জন্য আবেদন',
      descEn: 'Apply for government subsidy',
      color: 'from-cyan-600 to-blue-600',
      category: 'financial'
    },

    // Legal & Police (7)
    {
      id: 'police-clearance',
      icon: Shield,
      titleBn: 'পুলিশ ক্লিয়ারেন্স',
      titleEn: 'Police Clearance',
      descBn: 'পুলিশ ক্লিয়ারেন্স সার্টিফিকেট',
      descEn: 'Police clearance certificate',
      color: 'from-red-600 to-orange-600',
      category: 'legal'
    },
    {
      id: 'character-certificate',
      icon: UserCheck,
      titleBn: 'চারিত্রিক সনদপত্র',
      titleEn: 'Character Certificate',
      descBn: 'চারিত্রিক সনদপত্রের জন্য আবেদন',
      descEn: 'Apply for character certificate',
      color: 'from-blue-600 to-purple-600',
      category: 'legal'
    },
    {
      id: 'legal-aid',
      icon: Scale,
      titleBn: 'আইনি সহায়তা',
      titleEn: 'Legal Aid',
      descBn: 'বিনামূল্যে আইনি সহায়তার জন্য আবেদন',
      descEn: 'Apply for free legal aid',
      color: 'from-indigo-600 to-blue-600',
      category: 'legal'
    },
    {
      id: 'court-case',
      icon: Landmark,
      titleBn: 'মামলা তথ্য',
      titleEn: 'Court Case Information',
      descBn: 'আদালতের মামলার তথ্য দেখুন',
      descEn: 'View court case information',
      color: 'from-purple-600 to-indigo-600',
      category: 'legal'
    },
    {
      id: 'fir-copy',
      icon: FileText,
      titleBn: 'এফআইআর কপি',
      titleEn: 'FIR Copy',
      descBn: 'প্রাথমিক তথ্য প্রতিবেদনের কপি',
      descEn: 'First Information Report copy',
      color: 'from-red-600 to-pink-600',
      category: 'legal'
    },
    {
      id: 'gd-copy',
      icon: Clipboard,
      titleBn: 'জিডি কপি',
      titleEn: 'GD Copy',
      descBn: 'সাধারণ ডায়েরি কপি',
      descEn: 'General Diary copy',
      color: 'from-orange-600 to-red-600',
      category: 'legal'
    },
    {
      id: 'notary',
      icon: FileCheck,
      titleBn: 'নোটারি সেবা',
      titleEn: 'Notary Service',
      descBn: 'ডকুমেন্ট নোটারি সেবা',
      descEn: 'Document notary service',
      color: 'from-teal-600 to-cyan-600',
      category: 'legal'
    },

    // Property & Land (6)
    {
      id: 'land-registration',
      icon: Home,
      titleBn: 'জমি নিবন্ধন',
      titleEn: 'Land Registration',
      descBn: 'জমি নিবন্ধন সেবা',
      descEn: 'Land registration service',
      color: 'from-green-600 to-teal-600',
      category: 'property'
    },
    {
      id: 'mutation',
      icon: MapPin,
      titleBn: 'নামজারি',
      titleEn: 'Mutation',
      descBn: 'জমির নামজারি সেবা',
      descEn: 'Land mutation service',
      color: 'from-teal-600 to-emerald-600',
      category: 'property'
    },
    {
      id: 'land-record',
      icon: FileText,
      titleBn: 'ভূমি রেকর্ড',
      titleEn: 'Land Record',
      descBn: 'ভূমি রেকর্ড দেখুন',
      descEn: 'View land records',
      color: 'from-emerald-600 to-green-600',
      category: 'property'
    },
    {
      id: 'holding-tax',
      icon: Building,
      titleBn: 'হোল্ডিং ট্যাক্স',
      titleEn: 'Holding Tax',
      descBn: 'হোল্ডিং ট্যাক্স পরিশোধ',
      descEn: 'Pay holding tax',
      color: 'from-blue-600 to-indigo-600',
      category: 'property'
    },
    {
      id: 'trade-license',
      icon: BriefcaseBusiness,
      titleBn: 'ট্রেড লাইসেন্স',
      titleEn: 'Trade License',
      descBn: 'ব্যবসায়িক লাইসেন্সের জন্য আবেদন',
      descEn: 'Apply for trade license',
      color: 'from-indigo-600 to-purple-600',
      category: 'property'
    },
    {
      id: 'building-permit',
      icon: Building,
      titleBn: 'বিল্ডিং পারমিট',
      titleEn: 'Building Permit',
      descBn: 'নির্মাণ অনুমতির জন্য আবেদন',
      descEn: 'Apply for construction permit',
      color: 'from-purple-600 to-pink-600',
      category: 'property'
    },

    // Transport (5)
    {
      id: 'driving-license',
      icon: Car,
      titleBn: 'ড্রাইভিং লাইসেন্স',
      titleEn: 'Driving License',
      descBn: 'ড্রাইভিং লাইসেন্সের জন্য আবেদন',
      descEn: 'Apply for driving license',
      color: 'from-blue-600 to-cyan-600',
      category: 'transport'
    },
    {
      id: 'vehicle-registration',
      icon: Car,
      titleBn: 'গাড়ি নিবন্ধন',
      titleEn: 'Vehicle Registration',
      descBn: 'যানবাহন নিবন্ধন সেবা',
      descEn: 'Vehicle registration service',
      color: 'from-cyan-600 to-teal-600',
      category: 'transport'
    },
    {
      id: 'vehicle-fitness',
      icon: Car,
      titleBn: 'গাড়ি ফিটনেস',
      titleEn: 'Vehicle Fitness',
      descBn: 'যানবাহন ফিটনেস সার্টিফিকেট',
      descEn: 'Vehicle fitness certificate',
      color: 'from-teal-600 to-green-600',
      category: 'transport'
    },
    {
      id: 'route-permit',
      icon: MapPin,
      titleBn: 'রুট পারমিট',
      titleEn: 'Route Permit',
      descBn: 'যানবাহন রুট পারমিট',
      descEn: 'Vehicle route permit',
      color: 'from-green-600 to-emerald-600',
      category: 'transport'
    },
    {
      id: 'tax-token',
      icon: Receipt,
      titleBn: 'ট্যাক্স টোকেন',
      titleEn: 'Tax Token',
      descBn: 'যানবাহন ট্যাক্স টোকেন',
      descEn: 'Vehicle tax token',
      color: 'from-orange-600 to-red-600',
      category: 'transport'
    },

    // Employment (5)
    {
      id: 'job-application',
      icon: Briefcase,
      titleBn: 'সরকারি চাকরি',
      titleEn: 'Government Job',
      descBn: 'সরকারি চাকরির আবেদন',
      descEn: 'Apply for government job',
      color: 'from-purple-600 to-indigo-600',
      category: 'employment'
    },
    {
      id: 'experience-certificate',
      icon: Award,
      titleBn: 'অভিজ্ঞতা সনদ',
      titleEn: 'Experience Certificate',
      descBn: 'চাকরির অভিজ্ঞতা সনদপত্র',
      descEn: 'Job experience certificate',
      color: 'from-indigo-600 to-blue-600',
      category: 'employment'
    },
    {
      id: 'unemployment-allowance',
      icon: DollarSign,
      titleBn: 'বেকারত্ব ভাতা',
      titleEn: 'Unemployment Allowance',
      descBn: 'বেকারত্ব ভাতার জন্য আবেদন',
      descEn: 'Apply for unemployment allowance',
      color: 'from-blue-600 to-cyan-600',
      category: 'employment'
    },
    {
      id: 'provident-fund',
      icon: DollarSign,
      titleBn: 'ভবিষ্যত তহবিল',
      titleEn: 'Provident Fund',
      descBn: 'ভবিষ্যত তহবিল সেবা',
      descEn: 'Provident fund service',
      color: 'from-cyan-600 to-teal-600',
      category: 'employment'
    },
    {
      id: 'skill-training',
      icon: GraduationCap,
      titleBn: 'দক্ষতা প্রশিক্ষণ',
      titleEn: 'Skill Training',
      descBn: 'সরকারি দক্ষতা প্রশিক্ষণ',
      descEn: 'Government skill training',
      color: 'from-teal-600 to-green-600',
      category: 'employment'
    },

    // Utilities (5)
    {
      id: 'electricity-connection',
      icon: Zap,
      titleBn: 'বিদ্যুৎ সংযোগ',
      titleEn: 'Electricity Connection',
      descBn: 'নতুন বিদ্যুৎ সংযোগের জন্য আবেদন',
      descEn: 'Apply for new electricity connection',
      color: 'from-yellow-500 to-orange-500',
      category: 'utilities'
    },
    {
      id: 'gas-connection',
      icon: Droplet,
      titleBn: 'গ্যাস সংযোগ',
      titleEn: 'Gas Connection',
      descBn: 'নতুন গ্যাস সংযোগের জন্য আবেদন',
      descEn: 'Apply for new gas connection',
      color: 'from-blue-500 to-indigo-500',
      category: 'utilities'
    },
    {
      id: 'water-connection',
      icon: Droplet,
      titleBn: 'পানি সংযোগ',
      titleEn: 'Water Connection',
      descBn: 'নতুন পানি সংযোগের জন্য আবেদন',
      descEn: 'Apply for new water connection',
      color: 'from-cyan-500 to-blue-500',
      category: 'utilities'
    },
    {
      id: 'internet-connection',
      icon: Wifi,
      titleBn: 'ইন্টারনেট সংযোগ',
      titleEn: 'Internet Connection',
      descBn: 'সরকারি ইন্টারনেট সংযোগ',
      descEn: 'Government internet connection',
      color: 'from-purple-500 to-pink-500',
      category: 'utilities'
    },
    {
      id: 'phone-connection',
      icon: Phone,
      titleBn: 'ফোন সংযোগ',
      titleEn: 'Phone Connection',
      descBn: 'টেলিফোন সংযোগের জন্য আবেদন',
      descEn: 'Apply for telephone connection',
      color: 'from-green-500 to-emerald-500',
      category: 'utilities'
    },

    // Agriculture (4)
    {
      id: 'agricultural-loan',
      icon: Wheat,
      titleBn: 'কৃষি ঋণ',
      titleEn: 'Agricultural Loan',
      descBn: 'কৃষি ঋণের জন্য আবেদন',
      descEn: 'Apply for agricultural loan',
      color: 'from-green-600 to-lime-600',
      category: 'agriculture'
    },
    {
      id: 'farmer-card',
      icon: UserCheck,
      titleBn: 'কৃষক কার্ড',
      titleEn: 'Farmer Card',
      descBn: 'কৃষক পরিচয়পত্রের জন্য আবেদন',
      descEn: 'Apply for farmer identification card',
      color: 'from-lime-600 to-green-600',
      category: 'agriculture'
    },
    {
      id: 'fertilizer-subsidy',
      icon: TreePine,
      titleBn: 'সার ভর্তুকি',
      titleEn: 'Fertilizer Subsidy',
      descBn: 'সার ভর্তুকির জন্য আবেদন',
      descEn: 'Apply for fertilizer subsidy',
      color: 'from-emerald-600 to-teal-600',
      category: 'agriculture'
    },
    {
      id: 'crop-insurance',
      icon: Shield,
      titleBn: 'ফসল বীমা',
      titleEn: 'Crop Insurance',
      descBn: 'ফসল বীমার জন্য আবেদন',
      descEn: 'Apply for crop insurance',
      color: 'from-teal-600 to-cyan-600',
      category: 'agriculture'
    },

    // Others (4)
    {
      id: 'hajj-registration',
      icon: Globe,
      titleBn: 'হজ্জ নিবন্ধন',
      titleEn: 'Hajj Registration',
      descBn: 'হজ্জ নিবন্ধনের জন্য আবেদন',
      descEn: 'Apply for Hajj registration',
      color: 'from-green-600 to-emerald-600',
      category: 'others'
    },
    {
      id: 'disability-card',
      icon: Heart,
      titleBn: 'প্রতিবন্ধী কার্ড',
      titleEn: 'Disability Card',
      descBn: 'প্রতিবন্ধী পরিচয়পত্র',
      descEn: 'Disability identification card',
      color: 'from-pink-600 to-rose-600',
      category: 'others'
    },
    {
      id: 'freedom-fighter',
      icon: Award,
      titleBn: 'মুক্তিযোদ্ধা সনদ',
      titleEn: 'Freedom Fighter Certificate',
      descBn: 'মুক্তিযোদ্ধা সনদপত্র',
      descEn: 'Freedom fighter certificate',
      color: 'from-red-600 to-orange-600',
      category: 'others'
    },
    {
      id: 'help-support',
      icon: HelpCircle,
      titleBn: 'সহায়তা কেন্দ্র',
      titleEn: 'Help & Support',
      descBn: 'সাহায্য ও সহায়তা পান',
      descEn: 'Get help and support',
      color: 'from-blue-600 to-indigo-600',
      category: 'others'
    }
  ];

  const categories = [
    { id: 'all', nameBn: 'সকল', nameEn: 'All' },
    { id: 'identity', nameBn: 'পরিচয় ও নিবন্ধন', nameEn: 'Identity & Registration' },
    { id: 'education', nameBn: 'শিক্ষা', nameEn: 'Education' },
    { id: 'financial', nameBn: 'আর্থিক', nameEn: 'Financial' },
    { id: 'legal', nameBn: 'আইনি', nameEn: 'Legal' },
    { id: 'property', nameBn: 'সম্পত্তি', nameEn: 'Property' },
    { id: 'transport', nameBn: 'যানবাহন', nameEn: 'Transport' },
    { id: 'employment', nameBn: 'কর্মসংস্থান', nameEn: 'Employment' },
    { id: 'utilities', nameBn: 'ইউটিলিটি', nameEn: 'Utilities' },
    { id: 'agriculture', nameBn: 'কৃষি', nameEn: 'Agriculture' },
    { id: 'others', nameBn: 'অন্যান্য', nameEn: 'Others' }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.descBn.includes(searchQuery) ||
      service.descEn.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('সরকারি সেবাসমূহ', 'Government Services')}
          </h1>
          <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আপনার প্রয়োজনীয় সেবা বেছে নিন', 'Choose the service you need')}
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[rgb(var(--color-accent-light))] to-white border border-[rgb(var(--color-accent))]"
        >
          <h3 className={`mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('সহজ আবেদন প্রক্রিয়া', 'Easy Application Process')}
          </h3>
          <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t(
              'আপনার পরিচয় যাচাইকৃত থাকায়, ফর্মগুলো স্বয়ংক্রিয়ভাবে পূরণ হয়ে যাবে। শুধু প্রয়োজনীয় তথ্য যোগ করুন।',
              'Since your identity is verified, forms will be auto-filled. Just add the required information.'
            )}
          </p>
        </motion.div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('সেবা খুঁজুন...', 'Search for service...')}
              className="w-full p-3 rounded-2xl border border-[rgb(var(--color-border))] focus:outline-none focus:border-[rgb(var(--color-accent))] transition-colors"
            />
            <svg
              className="absolute top-3 right-3 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="w-full md:w-1/2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[rgb(var(--color-border))] focus:outline-none focus:border-[rgb(var(--color-accent))] transition-colors"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {t(category.nameBn, category.nameEn)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link to={`/apply/${service.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-white rounded-2xl p-6 border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] transition-colors cursor-pointer group"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className={`mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(service.titleBn, service.titleEn)}
                  </h3>
                  <p className={`text-sm text-[rgb(var(--color-text-secondary))] mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(service.descBn, service.descEn)}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-[rgb(var(--color-accent))] group-hover:gap-3 transition-all">
                    <span className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('আবেদন করুন', 'Apply Now')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-2xl bg-white border border-[rgb(var(--color-border))]"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <h3 className={`mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('কীভাবে আবেদন করবেন?', 'How to Apply?')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[rgb(var(--color-accent))]">১</span>
              </div>
              <div>
                <h4 className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('সেবা নির্বাচন করুন', 'Select Service')}
                </h4>
                <p className={`text-xs text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('উপরের তালিকা থেকে বেছে নিন', 'Choose from the list above')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[rgb(var(--color-accent))]">২</span>
              </div>
              <div>
                <h4 className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ফর্ম পূরণ করুন', 'Fill the Form')}
                </h4>
                <p className={`text-xs text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('অধিকাংশ তথ্য স্বয়ংক্রিয় পূরণ হবে', 'Most info will be auto-filled')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[rgb(var(--color-accent))]">৩</span>
              </div>
              <div>
                <h4 className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('জমা দিন ও ট্র্যাক করুন', 'Submit & Track')}
                </h4>
                <p className={`text-xs text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('রিয়েল-টাইমে অগ্রগতি দেখুন', 'Track progress in real-time')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}