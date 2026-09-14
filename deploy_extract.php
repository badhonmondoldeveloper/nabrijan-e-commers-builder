<?php
header('Content-Type: text/plain');
$appDir = '/home/nabrijan/app';
$nodevenvDir = '/home/nabrijan/nodevenv/app/20/lib/node_modules/.prisma';

$prismaTar = $appDir . '/node_modules/.prisma/prisma_client.tar.gz';
if (file_exists($prismaTar)) {
    // Extract to app node_modules/.prisma
    $cmd1 = "cd " . escapeshellarg($appDir . '/node_modules/.prisma') . " && tar -xzf " . escapeshellarg($prismaTar) . " 2>&1";
    $res1 = shell_exec($cmd1);
    echo "PRISMA EXTRACT 1 OUTPUT:\n" . ($res1 ? $res1 : "Successfully extracted client to app node_modules/.prisma.") . "\n\n";

    // Extract to nodevenv node_modules/.prisma
    $cmd2 = "mkdir -p " . escapeshellarg($nodevenvDir) . " && cd " . escapeshellarg($nodevenvDir) . " && tar -xzf " . escapeshellarg($prismaTar) . " 2>&1";
    $res2 = shell_exec($cmd2);
    echo "PRISMA EXTRACT 2 OUTPUT:\n" . ($res2 ? $res2 : "Successfully extracted client to nodevenv node_modules/.prisma.") . "\n\n";

    // Also copy debian binaries to node_modules/@prisma/client just in case
    shell_exec("cp /home/nabrijan/app/node_modules/.prisma/client/*.so.node /home/nabrijan/app/node_modules/@prisma/client/ 2>&1");
    shell_exec("cp /home/nabrijan/app/node_modules/.prisma/client/*.so.node /home/nabrijan/nodevenv/app/20/lib/node_modules/@prisma/client/ 2>&1");
} else {
    echo "prisma_client.tar.gz not found at $prismaTar\n\n";
}

$nextTar = $appDir . '/next_build.tar.gz';
if (file_exists($nextTar)) {
    $cmd = "cd " . escapeshellarg($appDir) . " && tar -xzf " . escapeshellarg($nextTar) . " 2>&1";
    $res = shell_exec($cmd);
    echo "NEXT_BUILD EXTRACT OUTPUT:\n" . ($res ? $res : "Successfully extracted .next directory.") . "\n\n";
}

$touchCmd = "mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1";
$touchRes = shell_exec($touchCmd);
echo "RESTART OUTPUT:\n" . ($touchRes ? $touchRes : "Successfully touched tmp/restart.txt to restart Node.js app.") . "\n";
?>
