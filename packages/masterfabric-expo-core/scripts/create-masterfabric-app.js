#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Create MasterFabric Expo App CLI
 */
class MasterFabricAppCreator {
  constructor() {
    this.projectName = process.argv[2];
    this.projectPath = path.join(process.cwd(), this.projectName);
  }

  /**
   * Main execution
   */
  async run() {
    try {
      console.log('🚀 Creating MasterFabric Expo App...\n');
      
      this.validateInput();
      this.createProject();
      this.copyTemplateFiles();
      this.installDependencies();
      this.setupProject();
      
      console.log('\n✅ MasterFabric Expo App created successfully!');
      console.log(`\n📁 Project location: ${this.projectPath}`);
      console.log('\n🚀 To get started:');
      console.log(`   cd ${this.projectName}`);
      console.log('   npm start');
      console.log('\n📚 Documentation: https://github.com/masterfabric-mobile/masterfabric-expo');
      
    } catch (error) {
      console.error('❌ Error creating app:', error.message);
      process.exit(1);
    }
  }

  /**
   * Validate input
   */
  validateInput() {
    if (!this.projectName) {
      throw new Error('Project name is required. Usage: npx create-masterfabric-app <project-name>');
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(this.projectName)) {
      throw new Error('Project name can only contain letters, numbers, hyphens, and underscores');
    }

    if (fs.existsSync(this.projectPath)) {
      throw new Error(`Directory ${this.projectName} already exists`);
    }
  }

  /**
   * Create project directory
   */
  createProject() {
    console.log(`📁 Creating project directory: ${this.projectName}`);
    fs.mkdirSync(this.projectPath, { recursive: true });
  }

  /**
   * Copy template files
   */
  copyTemplateFiles() {
    console.log('📋 Copying template files...');
    
    const templatePath = path.join(__dirname, '../templates/expo-app-template');
    this.copyDirectory(templatePath, this.projectPath);
  }

  /**
   * Copy directory recursively
   */
  copyDirectory(src, dest) {
    const files = fs.readdirSync(src);
    
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  /**
   * Install dependencies
   */
  installDependencies() {
    console.log('📦 Installing dependencies...');
    
    try {
      execSync('npm install', {
        cwd: this.projectPath,
        stdio: 'inherit'
      });
    } catch (error) {
      console.warn('⚠️  npm install failed, trying yarn...');
      try {
        execSync('yarn install', {
          cwd: this.projectPath,
          stdio: 'inherit'
        });
      } catch (yarnError) {
        throw new Error('Failed to install dependencies. Please run npm install or yarn install manually.');
      }
    }
  }

  /**
   * Setup project
   */
  setupProject() {
    console.log('⚙️  Setting up project...');
    
    // Update package.json with project name
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = this.projectName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Create app.json if it doesn't exist
    const appJsonPath = path.join(this.projectPath, 'app.json');
    if (!fs.existsSync(appJsonPath)) {
      const appJson = {
        expo: {
          name: this.projectName,
          slug: this.projectName,
          version: "1.0.0",
          orientation: "portrait",
          icon: "./assets/icon.png",
          userInterfaceStyle: "light",
          splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
          },
          assetBundlePatterns: [
            "**/*"
          ],
          ios: {
            supportsTablet: true
          },
          android: {
            adaptiveIcon: {
              foregroundImage: "./assets/adaptive-icon.png",
              backgroundColor: "#ffffff"
            }
          },
          web: {
            favicon: "./assets/favicon.png"
          }
        }
      };
      fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    }
    
    // Create assets directory
    const assetsPath = path.join(this.projectPath, 'assets');
    if (!fs.existsSync(assetsPath)) {
      fs.mkdirSync(assetsPath);
    }
    
    // Create tsconfig.json if it doesn't exist
    const tsconfigPath = path.join(this.projectPath, 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath)) {
      const tsconfig = {
        extends: "expo/tsconfig.base",
        compilerOptions: {
          strict: true
        }
      };
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }
  }
}

// Run the creator
if (require.main === module) {
  const creator = new MasterFabricAppCreator();
  creator.run();
}

module.exports = MasterFabricAppCreator;
