import pc from 'picocolors';
import {DEPENDENCIES} from '../../../../src/dependencies';
import {
  Framework,
  FrameworkTypes,
  FrameworkVariants,
} from '../../../../src/interfaces';
import {SharedTemplates} from '../../../../src/generatedTemplatesList';

const CONFIG: Framework = {
  type: FrameworkTypes.UNIVERSAL,
  name: 'nextjs',
  display: 'Next.js framework with Web SDK and API client installed',
  color: pc.magenta,
  sdkUri: 'http://localhost:3000',
  redirectUri: 'http://localhost:3000/api/redirect',
  scopes: ['boards:read', 'boards:write'],
  customPackageJSONFields: {
    scripts: {
      build: 'next build',
      start: 'next dev',
      lint: 'next lint',
    },
  },
  customTSConfig: {
    include: ['src', 'app', '*.ts', '.next/types/**/*.ts'],
    compilerOptions: {
      plugins: [
        {
          name: 'next',
        },
      ],
    },
  },
  templates: [SharedTemplates.ClientAssets],
  variants: [
    {
      name: FrameworkVariants.js,
      display: 'JavaScript',
      color: pc.yellow,
      deps: {
        dependencies: {
          ...DEPENDENCIES.next,
          ...DEPENDENCIES.miroNode,
          ...DEPENDENCIES.mirotone,
          ...DEPENDENCIES.react,
          ...DEPENDENCIES.reactDom,
          ...DEPENDENCIES.dotenv,
          ...DEPENDENCIES.cookie,
        },
        devDependencies: {},
      },
    },
    {
      name: FrameworkVariants.ts,
      display: 'TypeScript',
      color: pc.blue,
      deps: {
        dependencies: {
          ...DEPENDENCIES.next,
          ...DEPENDENCIES.miroNode,
          ...DEPENDENCIES.mirotone,
          ...DEPENDENCIES.react,
          ...DEPENDENCIES.reactDom,
          ...DEPENDENCIES.dotenv,
          ...DEPENDENCIES.cookie,
        },
        devDependencies: {
          ...DEPENDENCIES.miroWebSdkTypes,
          ...DEPENDENCIES.typescript,
          ...DEPENDENCIES.nodeTypes,
          ...DEPENDENCIES.reactTypes,
          ...DEPENDENCIES.cookieTypes,
        },
      },
    },
  ],
};
export default CONFIG;
