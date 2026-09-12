import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';

const execPromise = util.promisify(exec);

export async function GET(req: Request) {
  try {
    const targetDir = '/home/nabrijan/nodevenv/app_deploy/20/lib/node_modules/.prisma/client';
    const tarFile = `${targetDir}/prisma_client_fix.tar.gz`;

    if (!fs.existsSync(tarFile)) {
      return NextResponse.json({
        success: false,
        message: `Tar file not found at ${tarFile}`,
      }, { status: 404 });
    }

    const { stdout, stderr } = await execPromise(`cd ${targetDir} && tar -xzf prisma_client_fix.tar.gz`);

    let configSnippet = 'index.js not found';
    if (fs.existsSync(`${targetDir}/index.js`)) {
      const content = fs.readFileSync(`${targetDir}/index.js`, 'utf8');
      const idx = content.indexOf('config = {');
      if (idx !== -1) {
        configSnippet = content.slice(idx, idx + 350);
      }
    }

    // Touch restart.txt to refresh worker process
    const appDir = '/home/nabrijan/app_deploy';
    if (!fs.existsSync(`${appDir}/tmp`)) {
      fs.mkdirSync(`${appDir}/tmp`, { recursive: true });
    }
    fs.writeFileSync(`${appDir}/tmp/restart.txt`, String(Date.now()));

    return NextResponse.json({
      success: true,
      message: 'Prisma Client successfully unpacked and updated to Library Engine',
      stdout,
      stderr,
      configSnippet,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
