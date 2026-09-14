<?php
header('Content-Type: text/plain');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$appDir = '/home/nabrijan/app';
$pubDir = '/home/nabrijan/public_html';
$nextTar = $appDir . '/next_build.tar.gz';
$appTar = $appDir . '/app_deploy.tar.gz';

$githubNextUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';
$githubAppUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/app_deploy.tar.gz';

echo "=== 1. DOWNLOADING LIGHTWEIGHT NEXT BUILD (18MB) ===\n";
@copy($githubNextUrl, $nextTar);
echo "Downloaded build size: " . (file_exists($nextTar) ? filesize($nextTar) : 0) . " bytes\n\n";

if (file_exists($nextTar) && filesize($nextTar) > 1000) {
    echo "=== 2. WIPING OLD .NEXT AND EXTRACTING ===\n";
    $cmd = "rm -rf " . escapeshellarg($appDir . '/.next') . " && tar -xzf " . escapeshellarg($nextTar) . " -C " . escapeshellarg($appDir) . " 2>&1";
    exec($cmd, $out, $ret);
    echo "Extract ret code: $ret\n" . implode("\n", $out) . "\n\n";
    
    // Clean up archive immediately to save disk space
    @unlink($nextTar);
    echo "Cleaned up temporary archive to free disk space.\n\n";
}

if (file_exists($appTar)) {
    exec("tar -xzf " . escapeshellarg($appTar) . " -C " . escapeshellarg($appDir) . " 2>&1", $out1, $ret1);
    @unlink($appTar);
    echo "Cleaned up app_deploy.tar.gz to free disk space.\n\n";
}

// Copy updated php files to public_html so Apache sees them immediately
if (file_exists($pubDir)) {
    @copy($appDir . '/check_logs.php', $pubDir . '/check_logs.php');
    @copy($appDir . '/deploy_extract.php', $pubDir . '/deploy_extract.php');
    @copy($appDir . '/extract.php', $pubDir . '/extract.php');
    @copy($appDir . '/unpacker.php', $pubDir . '/unpacker.php');
}

// Remove stale static HTML cached pages if any exist
@unlink($pubDir . '/pricing.html');
@unlink($pubDir . '/pricing/index.html');
@unlink($appDir . '/public/pricing.html');
@unlink($appDir . '/public/pricing/index.html');

echo "=== 3. RESTARTING PASSENGER NODE.JS APP ===\n";
exec("pkill -9 -f node 2>&1", $killOut, $killRet);
exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1");
echo "Done. Node processes killed & Passenger restarted cleanly.\n";
?>
