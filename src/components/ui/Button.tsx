import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95 transition-transform duration-100',
            secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-transform duration-100',
            outline: 'border-2 border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700 active:scale-95 transition-transform duration-100',
            ghost: 'hover:bg-gray-100 text-gray-600 active:scale-95 transition-transform duration-100',
            danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition-transform duration-100',
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-6 text-lg',
            icon: 'h-10 w-10 p-0 flex items-center justify-center',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
