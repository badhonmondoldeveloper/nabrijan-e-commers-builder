import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const appDir = '/home/nabrijan/app';
    const nextTarUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';
    const targetTar = path.join(appDir, 'next_build.tar.gz');

    // 1. Git pull latest code
    let gitRes = '';
    try {
      gitRes = execSync('cd /home/nabrijan/app && git pull origin main', { encoding: 'utf-8' });
    } catch (e: any) {
      gitRes = e.message;
    }

    // 2. Download lightweight next_build.tar.gz (18MB) from GitHub raw
    let downRes = '';
    try {
      downRes = execSync(`curl -s -L -o "${targetTar}" "${nextTarUrl}"`, { encoding: 'utf-8' });
    } catch (e: any) {
      downRes = e.message;
    }

    // 3. Extract .next build
    let extractRes = '';
    if (fs.existsSync(targetTar) && fs.statSync(targetTar).size > 1000) {
      try {
        extractRes = execSync(`rm -rf "${path.join(appDir, '.next')}" && cd "${appDir}" && tar -xzf "${targetTar}" && rm -f "${targetTar}"`, { encoding: 'utf-8' });
      } catch (e: any) {
        extractRes = e.message;
      }
    }

    // 4. Touch restart.txt
    try {
      const tmpDir = path.join(appDir, 'tmp');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, 'restart.txt'), String(Date.now()));
    } catch (e: any) {
      console.error('Restart touch error:', e);
    }

    return NextResponse.json({
      success: true,
      gitRes,
      downRes,
      extractRes,
      message: 'Deployment and build sync complete.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
