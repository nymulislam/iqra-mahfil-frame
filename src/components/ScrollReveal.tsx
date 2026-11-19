'use client';

import React from 'react';
import { m, type Variants } from 'motion/react';

export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export const VIEWPORT_CONFIG = {
  once: true,
  amount: 0.08,
  margin: '0px 0px -24px 0px',
} as const;

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  y = 18,
  duration = 0.5,
}: ScrollRevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_CONFIG}
      transition={{
        duration,
        delay,
        ease: EASE_SMOOTH,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  mode?: 'inView' | 'mount';
}

export function StaggerGroup({
  children,
  className = '',
  staggerDelay = 0.075,
  delayChildren = 0.04,
  mode = 'inView',
}: StaggerGroupProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  if (mode === 'mount') {
    return (
      <m.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      className={className}
    >
      {children}
    </m.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
}

export function StaggerItem({
  children,
  className = '',
  y = 18,
}: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.48,
        ease: EASE_SMOOTH,
      },
    },
  };

  return (
    <m.div variants={itemVariants} className={className}>
      {children}
    </m.div>
  );
}
