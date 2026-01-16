'use client';
import { cn } from '@/lib/utils';
import { motion, Transition } from 'motion/react';

export type GlowEffectProps = {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  mode?:
    | 'rotate'
    | 'pulse'
    | 'breathe'
    | 'colorShift'
    | 'flowHorizontal'
    | 'static';
  blur?: number | 'softest' | 'soft' | 'medium' | 'strong' | 'stronger';
  transition?: Transition;
  scale?: number;
};

const blurMap = {
  softest: 20,
  soft: 30,
  medium: 40,
  strong: 60,
  stronger: 80,
};

export function GlowEffect({
  className,
  style,
  colors = ['#22c55e', '#3b82f6', '#a855f7', '#ec4899'],
  mode = 'rotate',
  blur = 'medium',
  transition,
  scale = 1,
}: GlowEffectProps) {
  const blurValue = typeof blur === 'number' ? blur : blurMap[blur];

  const getGradient = () => {
    return `conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`;
  };

  const getAnimation = () => {
    switch (mode) {
      case 'rotate':
        return {
          rotate: [0, 360],
        };
      case 'pulse':
        return {
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        };
      case 'breathe':
        return {
          scale: [0.95, 1.05, 0.95],
          opacity: [0.6, 0.9, 0.6],
        };
      case 'colorShift':
        return {
          filter: [
            'hue-rotate(0deg)',
            'hue-rotate(180deg)',
            'hue-rotate(360deg)',
          ],
        };
      case 'flowHorizontal':
        return {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        };
      case 'static':
      default:
        return {};
    }
  };

  const getTransition = (): Transition => {
    if (transition) return transition;

    switch (mode) {
      case 'rotate':
        return {
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        };
      case 'pulse':
        return {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        };
      case 'breathe':
        return {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        };
      case 'colorShift':
        return {
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        };
      case 'flowHorizontal':
        return {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={cn(
        'pointer-events-none absolute inset-0 -z-10',
        className
      )}
      style={{
        background: getGradient(),
        filter: `blur(${blurValue}px)`,
        transform: `scale(${scale})`,
        ...style,
      }}
      animate={getAnimation()}
      transition={getTransition()}
    />
  );
}
