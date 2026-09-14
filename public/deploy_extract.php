<?php
header('Content-Type: text/plain');
$appDir = '/home/nabrijan/app';
$githubUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';
$targetTar = $appDir . '/next_build.tar.gz';

echo "=== 1. DOWNLOADING LATEST NEXT_BUILD.TAR.GZ FROM GITHUB ===\n";
$downloadCmd = "curl -s -L -o " . escapeshellarg($targetTar) . " " . escapeshellarg($githubUrl) . " 2>&1";
$downloadRes = shell_exec($downloadCmd);
echo ($downloadRes ? $downloadRes : "Download command executed.") . " File size: " . (file_exists($targetTar) ? filesize($targetTar) : 0) . " bytes\n\n";

if (file_exists($targetTar) && filesize($targetTar) > 1000) {
    echo "=== 2. WIPING OLD .NEXT AND EXTRACTING ===\n";
    $cmd = "rm -rf " . escapeshellarg($appDir . '/.next') . " && cd " . escapeshellarg($appDir) . " && tar -xzf " . escapeshellarg($targetTar) . " 2>&1";
    $res = shell_exec($cmd);
    echo ($res ? $res : "Successfully extracted new .next directory.") . "\n\n";
} else {
    echo "=== 2. ERROR: DOWNLOADED ARCHIVE INVALID OR EMPTY ===\n\n";
}

echo "=== 3. GIT PULL SOURCE FILES ===\n";
$gitPull = shell_exec("cd " . escapeshellarg($appDir) . " && git pull origin main 2>&1");
echo ($gitPull ? $gitPull : "Git pull executed.") . "\n\n";

echo "=== 4. RESTARTING PASSENGER NODE.JS APP ===\n";
$touchCmd = "mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1";
$touchRes = shell_exec($touchCmd);
echo ($touchRes ? $touchRes : "Successfully touched tmp/restart.txt.") . "\n";
?>
