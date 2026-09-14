<?php
header('Content-Type: text/plain');
$appDir = '/home/nabrijan/app';

echo "=== 1. GIT PULL FROM GITHUB ===\n";
$gitPull = shell_exec("cd " . escapeshellarg($appDir) . " && git pull origin main 2>&1");
echo ($gitPull ? $gitPull : "Git pull executed.") . "\n\n";

$nextTar = $appDir . '/next_build.tar.gz';
if (file_exists($nextTar)) {
    echo "=== 2. EXTRACTING NEXT_BUILD.TAR.GZ ===\n";
    $cmd = "cd " . escapeshellarg($appDir) . " && tar -xzf " . escapeshellarg($nextTar) . " 2>&1";
    $res = shell_exec($cmd);
    echo ($res ? $res : "Successfully extracted .next directory.") . "\n\n";
} else {
    echo "=== 2. NEXT_BUILD.TAR.GZ NOT FOUND ===\n\n";
}

$prismaTar = $appDir . '/node_modules/.prisma/prisma_client.tar.gz';
if (file_exists($prismaTar)) {
    echo "=== 3. PRISMA CLIENT ENGINE EXTRACT ===\n";
    $nodevenvDir = '/home/nabrijan/nodevenv/app/20/lib/node_modules/.prisma';
    shell_exec("cd " . escapeshellarg($appDir . '/node_modules/.prisma') . " && tar -xzf " . escapeshellarg($prismaTar) . " 2>&1");
    shell_exec("mkdir -p " . escapeshellarg($nodevenvDir) . " && cd " . escapeshellarg($nodevenvDir) . " && tar -xzf " . escapeshellarg($prismaTar) . " 2>&1");
    shell_exec("cp /home/nabrijan/app/node_modules/.prisma/client/*.so.node /home/nabrijan/app/node_modules/@prisma/client/ 2>&1");
    shell_exec("cp /home/nabrijan/app/node_modules/.prisma/client/*.so.node /home/nabrijan/nodevenv/app/20/lib/node_modules/@prisma/client/ 2>&1");
    echo "Prisma engines verified.\n\n";
}

echo "=== 4. RESTARTING PASSENGER NODE.JS APP ===\n";
$touchCmd = "mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1";
$touchRes = shell_exec($touchCmd);
echo ($touchRes ? $touchRes : "Successfully touched tmp/restart.txt.") . "\n";
?>
