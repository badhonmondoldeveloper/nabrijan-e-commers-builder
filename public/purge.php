<?php
header('Content-Type: text/plain');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$pubDir = '/home/nabrijan/public_html';
$appDir = '/home/nabrijan/app';

echo "=== 1. LISTING PUBLIC_HTML FILES ===\n";
$files = glob($pubDir . '/*') ?: [];
foreach ($files as $f) {
    echo basename($f) . " (" . (is_dir($f) ? 'DIR' : filesize($f) . ' bytes') . ")\n";
}

echo "\n=== 2. REMOVING STALE STATIC HTML PAGES IN PUBLIC_HTML ===\n";
$staleHtml = [
    $pubDir . '/pricing.html',
    $pubDir . '/pricing',
    $pubDir . '/index.html',
    $pubDir . '/dashboard',
    $appDir . '/public/pricing.html',
    $appDir . '/public/pricing',
];

foreach ($staleHtml as $p) {
    if (file_exists($p)) {
        if (is_dir($p)) {
            exec("rm -rf " . escapeshellarg($p));
            echo "Removed dir: $p\n";
        } else {
            @unlink($p);
            echo "Removed file: $p\n";
        }
    }
}

echo "\n=== 3. LITESPEED PURGE ===\n";
header("X-LiteSpeed-Purge: *");
echo "LiteSpeed purge header sent.\n";
?>
