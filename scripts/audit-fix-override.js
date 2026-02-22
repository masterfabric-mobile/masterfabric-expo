/**
 * Postinstall: Core workspace'taki eski glob/minimatch'ı root'taki güvenli sürümle değiştirir.
 * npm override'lar nested workspace node_modules'a uygulanmadığı için bu script gerekli.
 */
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const rootNodeModules = path.join(root, 'node_modules');
const coreNodeModules = path.join(root, 'packages', 'masterfabric-expo-core', 'node_modules');

if (!fs.existsSync(coreNodeModules)) {
  process.exit(0);
}

const coreGlob = path.join(coreNodeModules, 'glob');
const coreMinimatch = path.join(coreNodeModules, 'minimatch');
const rootGlob = path.join(rootNodeModules, 'glob');
const rootMinimatch = path.join(rootNodeModules, 'minimatch');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const srcPath = path.join(src, name);
    const destPath = path.join(dest, name);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function replaceWithRoot(pkgName, corePath, rootPath) {
  if (!fs.existsSync(corePath) || !fs.existsSync(rootPath)) return false;
  const pkgJson = path.join(rootPath, 'package.json');
  if (!fs.existsSync(pkgJson)) return false;
  const version = require(pkgJson).version;
  if (pkgName === 'minimatch' && parseFloat(version) < 10.2) return true;
  if (pkgName === 'glob' && parseFloat(version) < 11) return true;
  fs.rmSync(corePath, { recursive: true });
  copyRecursive(rootPath, corePath);
  console.log(`[audit-fix-override] ${pkgName} core'da güvenli sürümle güncellendi (${version}).`);
  return true;
}

let updated = false;
if (fs.existsSync(coreGlob)) {
  if (fs.existsSync(rootGlob)) {
    fs.rmSync(coreGlob, { recursive: true });
    copyRecursive(rootGlob, coreGlob);
    console.log('[audit-fix-override] packages/masterfabric-expo-core/node_modules/glob güvenli sürümle güncellendi.');
    updated = true;
  }
}
if (fs.existsSync(coreMinimatch)) {
  if (fs.existsSync(rootMinimatch)) {
    fs.rmSync(coreMinimatch, { recursive: true });
    copyRecursive(rootMinimatch, coreMinimatch);
    console.log('[audit-fix-override] packages/masterfabric-expo-core/node_modules/minimatch güvenli sürümle güncellendi.');
    updated = true;
  }
}
if (updated) {
  console.log('[audit-fix-override] Tamamlandı.');
}
