import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

export async function GET(req: NextRequest) {
  try {
    console.log('📢 Starting database backup...');
    const backupDirectory = path.join(process.cwd(), 'backups');
    await fs.mkdir(backupDirectory, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDirectory, `CRIS_BACKUP_DATA-${timestamp}.sql`);

    const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

    if (!DB_DATABASE || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
      console.error('❌ Missing required environment variables!');
      return NextResponse.json({ error: 'Missing required database environment variables' }, { status: 500 });
    }

    console.log('🔹 Database:', DB_DATABASE);
    console.log('🔹 User:', DB_USER);
    console.log('🔹 Host:', DB_HOST);
    console.log('🔹 Port:', DB_PORT);
    console.log('🔹 Backup file path:', backupFile);

    const pgDumpCommand = 'pg_dump';
    const args = [
      '-U', DB_USER,
      '-h', DB_HOST,
      '-p', DB_PORT,
      '-d', DB_DATABASE,
      '-F', 'p',
    ];

    console.log('📢 Running command:', pgDumpCommand, args.join(' '));

    const backupProcess = spawn(pgDumpCommand, args, {
      env: { ...process.env, PGPASSWORD: DB_PASSWORD },
      shell: true,
    });

    let backupData = '';
    backupProcess.stdout.on('data', (chunk) => (backupData += chunk.toString()));
    backupProcess.stderr.on('data', (chunk) => console.error('⚠️ pg_dump stderr:', chunk.toString()));

    return new Promise((resolve) => {
      backupProcess.on('close', async (code) => {
        if (code === 0) {
          await fs.writeFile(backupFile, backupData);
          console.log(`✅ Backup created successfully at: ${backupFile}`);
          resolve(
            new NextResponse(backupData, {
              headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename=backup-${timestamp}.sql`,
              },
            })
          );
        } else {
          console.error('❌ Backup process failed with exit code:', code);
          resolve(NextResponse.json({ error: `Backup process failed with exit code ${code}` }, { status: 500 }));
        }
      });
    });
  } catch (error: any) {
    console.error('❌ Backup failed with error:', error.message || error);
    return NextResponse.json({ error: `Backup failed: ${error.message || error}` }, { status: 500 });
  }
}