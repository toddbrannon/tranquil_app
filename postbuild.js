#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy built files to the correct location for production serving
const sourceDir = path.resolve(__dirname, 'dist', 'public');
const targetDir = path.resolve(__dirname, 'server', 'public');

if (fs.existsSync(sourceDir)) {
  // Remove existing target directory
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  
  // Copy source to target
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log('✓ Static files copied to server/public for production serving');
} else {
  console.error('✗ Build output not found at:', sourceDir);
  process.exit(1);
}