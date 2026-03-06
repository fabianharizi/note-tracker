import {
  ListTodo,
  CheckSquare,
  Folder,
  Briefcase,
  Home,
  ShoppingCart,
  BookOpen,
  Calendar,
  Target,
  Star,
  Heart,
  Utensils,
  Dumbbell,
  Car,
  Plane,
  Mail,
  FileText,
  Bookmark,
  Music,
  Camera,
  Wallet,
  GraduationCap,
  ClipboardList,
  ShoppingBag,
  Coffee,
} from 'lucide-react';

/** Icon id -> Lucide component for section icons (commonly used for tasks/lists) */
export const SECTION_ICONS = [
  { id: 'list-todo', label: 'Tasks', Icon: ListTodo },
  { id: 'check-square', label: 'Checklist', Icon: CheckSquare },
  { id: 'folder', label: 'Folder', Icon: Folder },
  { id: 'briefcase', label: 'Work', Icon: Briefcase },
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'shopping-cart', label: 'Shopping', Icon: ShoppingCart },
  { id: 'book-open', label: 'Study', Icon: BookOpen },
  { id: 'calendar', label: 'Calendar', Icon: Calendar },
  { id: 'target', label: 'Goals', Icon: Target },
  { id: 'star', label: 'Star', Icon: Star },
  { id: 'heart', label: 'Personal', Icon: Heart },
  { id: 'utensils', label: 'Food', Icon: Utensils },
  { id: 'dumbbell', label: 'Fitness', Icon: Dumbbell },
  { id: 'car', label: 'Travel', Icon: Car },
  { id: 'plane', label: 'Trip', Icon: Plane },
  { id: 'mail', label: 'Mail', Icon: Mail },
  { id: 'file-text', label: 'Notes', Icon: FileText },
  { id: 'bookmark', label: 'Bookmarks', Icon: Bookmark },
  { id: 'music', label: 'Music', Icon: Music },
  { id: 'camera', label: 'Photos', Icon: Camera },
  { id: 'wallet', label: 'Finance', Icon: Wallet },
  { id: 'graduation-cap', label: 'School', Icon: GraduationCap },
  { id: 'clipboard-list', label: 'List', Icon: ClipboardList },
  { id: 'shopping-bag', label: 'Store', Icon: ShoppingBag },
  { id: 'coffee', label: 'Cafe', Icon: Coffee },
];

const iconMap = Object.fromEntries(SECTION_ICONS.map((item) => [item.id, item.Icon]));

export function getSectionIconComponent(iconId) {
  return iconMap[iconId] || Folder;
}
