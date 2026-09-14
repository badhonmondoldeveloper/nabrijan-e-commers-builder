<?php
header('Content-Type: text/plain');
header('X-LiteSpeed-Purge: *');
$appDir = '/home/nabrijan/app';
$githubUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';
$targetTar = $appDir . '/next_build.tar.gz';

echo "=== 1. DOWNLOADING LATEST NEXT_BUILD.TAR.GZ FROM GITHUB ===\n";
$downloadCmd = "curl -s -L -o " . escapeshellarg($targetTar) . " " . escapeshellarg($githubUrl) . " 2>&1";
$downloadRes = shell_exec($downloadCmd);
echo ($downloadRes ? $downloadRes : "Download command executed.") . " File size: " . (file_exists($targetTar) ? filesize($targetTar) : 0) . " bytes\n\n";

if (file_exists($targetTar) && filesize($targetTar) > 1000) {
    echo "=== 2. WIPING OLD .NEXT AND EXTRACTING ===\n";
    $cmd = "rm -rf " . escapeshellarg($appDir . '/.next') . " && cd " . escapeshellarg($appDir) . " && tar -xzf " . escapeshellarg($targetTar) . " && rm -f " . escapeshellarg($targetTar) . " 2>&1";
    $res = shell_exec($cmd);
    echo ($res ? $res : "Successfully extracted new .next directory.") . "\n\n";
} else {
    echo "=== 2. ERROR: DOWNLOADED ARCHIVE INVALID OR EMPTY ===\n\n";
}

echo "=== 3. GIT PULL SOURCE FILES ===\n";
$gitPull = shell_exec("cd " . escapeshellarg($appDir) . " && git status 2>&1 && git pull origin main 2>&1");
echo ($gitPull ? $gitPull : "Git pull executed.") . "\n\n";

echo "=== 3.5 REMOVING STALE STATIC OVERRIDES IN PUBLIC_HTML ===\n";
$pubDir = '/home/nabrijan/public_html';
$staleFiles = glob($pubDir . '/*.html') ?: [];
foreach ($staleFiles as $sf) {
    @unlink($sf);
    echo "Removed static file: " . basename($sf) . "\n";
}
$staleDirs = [$pubDir . '/index.html', $pubDir . '/index', $pubDir . '/pricing.html', $pubDir . '/pricing'];
foreach ($staleDirs as $sd) {
    if (file_exists($sd)) {
        shell_exec("rm -rf " . escapeshellarg($sd));
        echo "Removed override: " . $sd . "\n";
    }
}
echo "\n";

echo "=== 4. DIAGNOSTICS & RESTARTING PASSENGER NODE.JS APP ===\n";
$findRes = shell_exec("find /home/nabrijan/ -name 'page.html' -o -name 'index.html' 2>&1");
echo "Found HTML files on server:\n" . $findRes . "\n";
if (file_exists('/home/nabrijan/app/.next/server/app/index.html')) {
    $idxContent = file_get_contents('/home/nabrijan/app/.next/server/app/index.html');
    echo "index.html size: " . strlen($idxContent) . " bytes\n";
    echo "Contains Panjabi: " . (strpos($idxContent, 'Panjabi') !== false ? 'YES' : 'NO') . "\n";
    echo "Contains SaaS: " . (strpos($idxContent, 'SaaS') !== false ? 'YES' : 'NO') . "\n";
}
shell_exec("pkill -9 -f node 2>&1");
$touchCmd = "mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1";
$touchRes = shell_exec($touchCmd);
echo ($touchRes ? $touchRes : "Successfully killed node and touched tmp/restart.txt.") . "\n\n";

echo "=== 5. LITESPEED CACHE PURGED ===\n";
echo "Sent X-LiteSpeed-Purge: * header.\n";
?>
