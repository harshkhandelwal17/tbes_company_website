import {
    Box,
    Layers,
    Zap,
    Droplets,
    Flame,
    FileText,
    Scan,
    MonitorPlay,
    Cuboid,
    DraftingCompass,
    Building2,
    Cpu,
    Wrench,
    Anchor,
    Globe,
    Server
} from 'lucide-react';

const icons: Record<string, any> = {
    Box,
    Layers,
    Zap,
    Droplets,
    Flame,
    FileText,
    Scan,
    MonitorPlay,
    Cuboid,
    DraftingCompass,
    Building2,
    Cpu,
    Wrench,
    Anchor,
    Globe,
    Server
};

const DynamicIcon = ({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => {
    const IconComponent = icons[name] || Box; // Fallback to Box
    return <IconComponent size={size} className={className} />;
};

export default DynamicIcon;
