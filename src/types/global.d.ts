declare module 'react' {
  import * as React from 'react';
  export = React;
}

declare module 'next/link' {
  import { LinkProps } from 'next/dist/client/link';
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'framer-motion' {
  export const motion: any;
} 