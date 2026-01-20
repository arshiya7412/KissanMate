export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Kannada';

export interface Land {
  id: string;
  name: string; // e.g., "Main Field"
  size: string;
  location: string;
}

export interface UserProfile {
  name: string;
  language: Language;
  goal: 'Income' | 'Hobby' | 'Organic Food' | 'Agri-tourism' | 'Land Productivity';
  waterSource: 'Borewell' | 'Canal' | 'Rain' | 'Unsure';
  involvement: 'Daily' | 'Weekend' | 'Hired Help' | 'Hands-off';
  budget: string; // Range string
  location: string;
  landSize: string;
  experienceLevel: 'None' | 'Beginner';
  lands?: Land[]; // Support multiple lands
  subscription?: 'Free' | 'Weekly' | 'Monthly' | 'Yearly';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
  isError?: boolean;
}

export interface CropRecommendation {
  id: string;
  name: string;
  suitability: number; // 0-100
  reason: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  costEstimate: string;
  duration: string;
}

export interface Task {
  id: string;
  week: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  isCustom?: boolean;
}

export type SoilType = 'Black' | 'Red' | 'Sandy' | 'Clay' | 'Loamy';
export type MoistureLevel = 'Low' | 'Medium' | 'High';
