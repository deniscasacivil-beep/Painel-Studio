import { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface DashboardLink {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: LucideIcon;
  tags?: string[];
  status?: 'Ativo' | 'Em manutenção' | 'Desativado';
}
