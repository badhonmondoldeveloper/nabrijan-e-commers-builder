<?php
header('Content-Type: text/plain');
$appDir = '/home/nabrijan/app';
$pubDir = '/home/nabrijan/public_html';

$appTarUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/app_deploy.tar.gz';
$nextTarUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';

$appTarFile = $appDir . '/app_deploy.tar.gz';
$nextTarFile = $appDir . '/next_build.tar.gz';

echo "=== 1. DOWNLOADING APP_DEPLOY.TAR.GZ FROM GITHUB ===\n";
shell_exec("curl -s -L -o " . escapeshellarg($appTarFile) . " " . escapeshellarg($appTarUrl) . " 2>&1");
echo "App archive size: " . (file_exists($appTarFile) ? filesize($appTarFile) : 0) . " bytes\n\n";

echo "=== 2. DOWNLOADING NEXT_BUILD.TAR.GZ FROM GITHUB ===\n";
shell_exec("curl -s -L -o " . escapeshellarg($nextTarFile) . " " . escapeshellarg($nextTarUrl) . " 2>&1");
echo "Next build archive size: " . (file_exists($nextTarFile) ? filesize($nextTarFile) : 0) . " bytes\n\n";

echo "=== 3. EXTRACTING APP CODE ===\n";
if (file_exists($appTarFile) && filesize($appTarFile) > 1000) {
    try {
        $phar = new PharData($appTarFile);
        $phar->extractTo($appDir, null, true);
        echo "Extracted app code to $appDir\n\n";
    } catch (Exception $e) {
        echo "App extract error: " . $e->getMessage() . "\n\n";
    }
}

echo "=== 4. EXTRACTING NEXT BUILD ===\n";
if (file_exists($nextTarFile) && filesize($nextTarFile) > 1000) {
    $cmd = "rm -rf " . escapeshellarg($appDir . '/.next') . " && cd " . escapeshellarg($appDir) . " && tar -xzf " . escapeshellarg($nextTarFile) . " 2>&1";
    $res = shell_exec($cmd);
    echo ($res ? $res : "Successfully extracted new .next folder.") . "\n\n";
}

echo "=== 5. RESTARTING PASSENGER ===\n";
shell_exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1");
echo "Passenger restart signal sent.\n";
?>
