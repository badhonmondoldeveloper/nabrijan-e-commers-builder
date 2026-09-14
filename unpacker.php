<?php
header('Content-Type: text/plain');
$appDir = '/home/nabrijan/app';
$dest = '/home/nabrijan/app';

echo "=== 1. DOWNLOADING LATEST NEXT_BUILD.TAR.GZ ===\n";
$githubUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';
$targetTar = $appDir . '/next_build.tar.gz';
shell_exec("curl -s -L -o " . escapeshellarg($targetTar) . " " . escapeshellarg($githubUrl) . " 2>&1");
echo "Downloaded size: " . (file_exists($targetTar) ? filesize($targetTar) : 0) . " bytes\n\n";

echo "=== 2. EXTRACTING NEXT_BUILD.TAR.GZ ===\n";
if (file_exists($targetTar) && filesize($targetTar) > 1000) {
    exec("rm -rf " . escapeshellarg($appDir . '/.next') . " && cd " . escapeshellarg($appDir) . " && tar -xzf " . escapeshellarg($targetTar) . " 2>&1", $out, $ret);
    echo "Next build extract ret: $ret\n" . implode("\n", $out) . "\n\n";
}

$tar1 = '/home/nabrijan/app/app_deploy.tar.gz';
if (file_exists($tar1)) {
    exec("tar -xzf $tar1 -C $dest 2>&1", $out1, $ret1);
    echo "App extract ret: $ret1\n" . implode("\n", $out1) . "\n\n";
}

echo "=== 3. RESTARTING PASSENGER ===\n";
exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1");
echo "Passenger restart completed.\n";
?>