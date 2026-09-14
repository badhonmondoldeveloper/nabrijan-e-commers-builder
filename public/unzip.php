<?php
header('Content-Type: text/plain');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$appDir = '/home/nabrijan/app';
$pubDir = '/home/nabrijan/public_html';
$nextTar = $appDir . '/next_build.tar.gz';
$githubNextUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';

echo "=== 1. DOWNLOADING NEXT_BUILD.TAR.GZ (18MB) ===\n";
@copy($githubNextUrl, $nextTar);
echo "Build archive size: " . (file_exists($nextTar) ? filesize($nextTar) : 0) . " bytes\n\n";

if (file_exists($nextTar) && filesize($nextTar) > 1000) {
    echo "=== 2. WIPING OLD .NEXT AND EXTRACTING ===\n";
    $cmd = "rm -rf " . escapeshellarg($appDir . '/.next') . " && tar -xzf " . escapeshellarg($nextTar) . " -C " . escapeshellarg($appDir) . " 2>&1";
    exec($cmd, $out, $ret);
    echo "Extract ret code: $ret\n" . implode("\n", $out) . "\n\n";
    @unlink($nextTar);
}

echo "=== 3. RESTARTING PASSENGER & NODE ===\n";
exec("pkill -9 -f node 2>&1");
exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1");
echo "Done. Passenger restarted.\n";
?>
