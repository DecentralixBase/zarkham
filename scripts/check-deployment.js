const fs = require('fs');
const path = require('path');

// Required files
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  '.eslintrc.json',
  'tailwind.config.js',
  'postcss.config.js',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/components/DashboardLayout.tsx',
  'src/components/WalletCard.tsx',
  'src/components/RadarChart.tsx',
  'src/components/ActivityFeed.tsx',
];

// Required dependencies
const requiredDependencies = [
  'next',
  'react',
  'react-dom',
  '@apollo/client',
  'chart.js',
  'framer-motion',
];

function checkFiles() {
  console.log('Checking required files...');
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      missingFiles.push(file);
    }
  });

  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles);
    process.exit(1);
  }
  
  console.log('✅ All required files present');
}

function checkDependencies() {
  console.log('Checking dependencies...');
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  const missingDeps = [];

  requiredDependencies.forEach(dep => {
    if (!packageJson.dependencies[dep]) {
      missingDeps.push(dep);
    }
  });

  if (missingDeps.length > 0) {
    console.error('❌ Missing required dependencies:', missingDeps);
    process.exit(1);
  }

  console.log('✅ All required dependencies present');
}

function checkTypeScript() {
  console.log('Checking TypeScript configuration...');
  const tsConfig = require(path.join(process.cwd(), 'tsconfig.json'));
  
  if (!tsConfig.compilerOptions.strict) {
    console.error('❌ TypeScript strict mode is not enabled');
    process.exit(1);
  }

  console.log('✅ TypeScript configuration valid');
}

function checkEnvironmentVariables() {
  console.log('Checking environment variables...');
  const envExample = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
  const requiredEnvVars = envExample.match(/^[A-Z_]+=/gm).map(v => v.slice(0, -1));
  
  const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missingEnvVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingEnvVars);
    console.warn('Make sure to set these in Vercel deployment settings');
  }
}

console.log('🔍 Starting deployment checks...\n');

try {
  checkFiles();
  checkDependencies();
  checkTypeScript();
  checkEnvironmentVariables();
  
  console.log('\n✅ All checks passed! Ready for deployment.');
} catch (error) {
  console.error('\n❌ Deployment checks failed:', error);
  process.exit(1);
} 