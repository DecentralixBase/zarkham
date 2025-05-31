declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'next/link' {
  import { LinkProps } from 'next/dist/client/link';
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'framer-motion' {
  export const motion: any;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
} 