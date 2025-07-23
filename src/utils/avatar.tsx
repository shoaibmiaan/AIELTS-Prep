// src/utils/avatar.ts
export const getDefaultAvatar = (user?: { name?: string; email?: string }) => {
  if (!user) return '/images/default-avatar.png';

  // Create initials from name or email
  const name = user.name || user.email || '';
  const initials = name
    .split(' ')
    .map(part => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  // Or use a colorful placeholder with initials
  return `https://ui-avatars.com/api/?name=${initials}&background=random`;
};