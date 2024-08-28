import pc from 'picocolors';

const DEPENDENCIES = {
  next: { next: '^14.0.0' },
  react: { react: '^18.2.0' },
  reactDom: { 'react-dom': '^18.2.0' },
  dotenv: { dotenv: '^16.0.3' },
};

const CONFIG = {
  name: 'nextjs',
  display: 'Next.js framework',
  color: pc.magenta,
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
  variants: [
    {
      name: 'js',
      display: 'JavaScript',
      color: pc.yellow,
      deps: {
        dependencies: {
          ...DEPENDENCIES.next,
          ...DEPENDENCIES.react,
          ...DEPENDENCIES.reactDom,
          ...DEPENDENCIES.dotenv,
        },
        devDependencies: {},
      },
    },
    {
      name: 'ts',
      display: 'TypeScript',
      color: pc.blue,
      deps: {
        dependencies: {
          ...DEPENDENCIES.next,
          ...DEPENDENCIES.react,
          ...DEPENDENCIES.reactDom,
          ...DEPENDENCIES.dotenv,
        },
        devDependencies: {
          typescript: '^5.0.0',
          '@types/node': '^18.0.0',
          '@types/react': '^18.0.0',
        },
      },
    },
  ],
};

export default CONFIG;