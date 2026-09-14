<?php
header('Content-Type: text/plain');
$tar = '/home/nabrijan/app/app_deploy.tar.gz';
$dest = '/home/nabrijan/app';

if (file_exists($tar)) {
    try {
        $phar = new PharData($tar);
        $phar->extractTo($dest, null, true);
        echo "EXTRACTION_SUCCESSFUL\n\n";
    } catch (Exception $e) {
        echo "ERR: " . $e->getMessage() . "\n\n";
    }
} else {
    echo "FILE_NOT_FOUND\n\n";
}

if (file_exists($dest . '/unpacker.php')) {
    echo "=== RUNNING AUTOMATED UNPACKER ===\n";
    require_once $dest . '/unpacker.php';
}
?>