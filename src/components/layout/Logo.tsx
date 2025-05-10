import { SpadeIcon } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
          <SpadeIcon className="w-6 h-6 text-primary-dark" />
        </div>
        <div className="absolute -inset-1 border border-accent rounded-full opacity-30 animate-pulse-slow" />
      </div>
      <span className="ml-2 text-xl font-heading font-bold text-accent">AceTogether</span>
    </div>
  );
};

export default Logo;