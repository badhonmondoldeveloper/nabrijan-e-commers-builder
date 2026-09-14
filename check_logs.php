<?php
header('Content-Type: text/plain');
$appDir = '/home/nabrijan/app';

if (isset($_GET['deploy']) || isset($_GET['update'])) {
    echo "=== 1. DOWNLOADING NEXT_BUILD.TAR.GZ FROM GITHUB RAW ===\n";
    $githubUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';
    $targetTar = $appDir . '/next_build.tar.gz';
    
    $downRes = shell_exec("curl -s -L -o " . escapeshellarg($targetTar) . " " . escapeshellarg($githubUrl) . " 2>&1");
    echo ($downRes ? $downRes : "Downloaded next_build.tar.gz.") . " File size: " . (file_exists($targetTar) ? filesize($targetTar) : 0) . " bytes\n\n";

    echo "=== 2. EXTRACTING .NEXT BUILD ===\n";
    $extractRes = shell_exec("rm -rf " . escapeshellarg($appDir . '/.next') . " && cd " . escapeshellarg($appDir) . " && tar -xzf " . escapeshellarg($targetTar) . " 2>&1");
    echo ($extractRes ? $extractRes : "Successfully extracted .next directory.") . "\n\n";

    echo "=== 3. RESTARTING PASSENGER ===\n";
    $restartRes = shell_exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1");
    echo ($restartRes ? $restartRes : "Successfully touched tmp/restart.txt.") . "\n";
    exit;
}

$logPaths = [
    '/home/nabrijan/logs/',
    '/home/nabrijan/app/passenger.log',
    '/tmp/',
    '/var/log/'
];

echo "=== FINDING RECENT LOG FILES ===\n";
$files = glob('/home/nabrijan/logs/*') ?: [];
$tmpFiles = glob('/tmp/*stderr*') ?: [];
$allFiles = array_merge($files, $tmpFiles);

foreach ($allFiles as $f) {
    if (is_file($f) && filesize($f) > 0) {
        echo "File: $f (" . filesize($f) . " bytes)\n";
        $lines = array_slice(file($f), -50);
        echo implode('', $lines) . "\n----------------------------------------\n";
    }
}

$passengerLog = shell_exec("ls -l /home/nabrijan/logs/ 2>&1");
echo "\n=== LOGS DIR CONTENT ===\n" . $passengerLog;
?>
