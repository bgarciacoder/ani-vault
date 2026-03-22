import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import { LucideIcon } from "lucide-react";

type IconName = keyof typeof LucideIcons;

type IconProps = {
    name: IconName;
    size?: number;
    color?: string;
    className?: string;
    strokeWidth?: number;
  } & React.SVGProps<SVGSVGElement>;
  

export default function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}: IconProps) {
    const IconComponent = LucideIcons?.[name] as LucideIcon;

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}