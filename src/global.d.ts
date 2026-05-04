// TypeScript declarations to fix module resolution errors
// These are minimal stubs for the portfolio project

declare module 'react' {
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type FormEvent = any;
  export type FormEvent<Element = Element, Event = any> = any;
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export type CSSProperties = any;
  export type HTMLAttributes<T> = any;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key: any): any;
  export function jsxs(type: any, props: any, key: any): any;
  export function Fragment(props: { children?: any }): any;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module 'lucide-react' {
  export const Copy: any;
  export const Check: any;
  export const Sparkles: any;
  export const ArrowRight: any;
  export const RotateCcw: any;
  export const Github: any;
  export const ExternalLink: any;
}

declare module 'wouter' {
  export function Link(props: any): any;
  export function Route(props: any): any;
  export function Switch(props: any): any;
  export function useLocation(): [string, (to: string) => void];
}

declare module '@radix-ui/react-slot' {
  export const Slot: any;
}
