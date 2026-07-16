import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "fade";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const animationClasses: Record<AnimationType, { initial: string; visible: string }> = {
  "fade-up": {
    initial: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    initial: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    initial: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    initial: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "zoom-in": {
    initial: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  "zoom-out": {
    initial: "opacity-0 scale-105",
    visible: "opacity-100 scale-100",
  },
  "fade": {
    initial: "opacity-0",
    visible: "opacity-100",
  },
};

export function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });
  const { initial, visible } = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? visible : initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// For animating lists of items with stagger effect
interface AnimatedListProps {
  children: ReactNode[];
  animation?: AnimationType;
  staggerDelay?: number;
  duration?: number;
  className?: string;
  itemClassName?: string;
  threshold?: number;
}

export function AnimatedList({
  children,
  animation = "fade-up",
  staggerDelay = 100,
  duration = 500,
  className,
  itemClassName,
  threshold = 0.1,
}: AnimatedListProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });
  const { initial, visible } = animationClasses[animation];

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all ease-out",
            isVisible ? visible : initial,
            itemClassName
          )}
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
