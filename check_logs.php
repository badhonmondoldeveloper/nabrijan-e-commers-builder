<?php
header('Content-Type: text/plain');
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

// Check if stdout/stderr log exists in passenger logs
$passengerLog = shell_exec("ls -l /home/nabrijan/logs/ 2>&1");
echo "\n=== LOGS DIR CONTENT ===\n" . $passengerLog;
?>
