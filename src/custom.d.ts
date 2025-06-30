declare module '*.svg?component' {
  import * as React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };
}

declare module '*.svg' {
  const src: string;
  export default src;
}
