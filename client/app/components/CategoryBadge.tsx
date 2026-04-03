import React from 'react';

interface Category {
  id: number;
  name: string;
  color?: string;
  icon?: string;
}

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
}

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses[size]}`}
      style={{
        backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
        color: category.color || '#374151',
        border: category.color ? `1px solid ${category.color}40` : '1px solid #d1d5db'
      }}
    >
      {category.icon && (
        <span className={iconSizeClasses[size]}>
          {category.icon}
        </span>
      )}
      {category.name}
    </span>
  );
}