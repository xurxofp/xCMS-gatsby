// server.js
import express from 'express';
import { spawn } from 'child_process';
import PQueue from 'p-queue';

const app = express();
app.use(express.json());

const queue = new PQueue({ concurrency: 1 });

function runBuild() {
  return new Promise((resolve, reject) => {
    console.log("Start rebuild");
    const build = spawn('npx', ['gatsby', 'build', '--log-pages'], {
      cwd: '/home/gatsby-app',
      env: process.env
    });
    build.stdout.pipe(process.stdout);
    build.stderr.pipe(process.stderr);

    build.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`Build falló con código ${code}`));
      }
      const deploy = spawn('aws', [
        's3', 'sync', 'public', `s3://${process.env.AWS_BUCKET}`,
        '--delete', '--size-only'
      ], { cwd: '/home/gatsby-app' });
      deploy.stdout.pipe(process.stdout);
      deploy.stderr.pipe(process.stderr);

      deploy.on('close', code2 => {
        if (code2 !== 0) {
          return reject(new Error(`Deploy S3 falló: ${code2}`));
        }
        resolve('Build incremental y deploy OK 🌐');
      });
      deploy.on('error', reject);
    });
    build.on('error', reject);
  });
}

app.post('/rebuild', async (req, res) => {
  try {
    const resultado = await queue.add(() => runBuild());
    res.send(resultado);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(4001, () => {
  console.log('🏃‍♂️ Webhook runner escuchando en puerto 4001');
});
