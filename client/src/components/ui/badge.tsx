import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset ',
    {
        variants: {
            variant: {
                default: 'bg-primary/20 border-transparent text-primary ring-primary/20',
                secondary: 'bg-secondary/20 border-transparent text-secondary ring-secondary/20',
                destructive: 'bg-destructive/10 border-transparent text-destructive',
                outline: 'text-foreground',
                red: 'text-red-400 ring-red-400/20 bg-red-400/10',
                yellow: 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20',
                green: 'bg-green-500/10 text-green-400 ring-green-500/20',
                blue: 'bg-blue-400/10 text-blue-400 ring-blue-400/30',
                indigo: 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30',
                purple: 'bg-purple-400/10 text-purple-400 ring-purple-400/30',
                pink: 'bg-pink-400/10 text-pink-400 ring-pink-400/20'
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
