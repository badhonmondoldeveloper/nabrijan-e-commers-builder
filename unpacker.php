<?php
header('Content-Type: text/plain');
$appDir = '/home/nabrijan/app';
$cmd = "curl -s -L -o " . escapeshellarg($appDir . '/next_build.tar.gz') . " 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz' && rm -rf " . escapeshellarg($appDir . '/.next') . " && cd " . escapeshellarg($appDir) . " && tar -xzf next_build.tar.gz && rm -f next_build.tar.gz && pkill -9 -f node 2>&1 && mkdir -p tmp && touch tmp/restart.txt 2>&1";

exec($cmd, $out, $ret);
echo "AUTOMATED DEPLOYMENT RESULT ($ret):\n" . implode("\n", $out) . "\n";
?>