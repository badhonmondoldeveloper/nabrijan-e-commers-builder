<?php
header('Content-Type: text/plain');
$appDir = '/home/nabrijan/app';
$pubDir = '/home/nabrijan/public_html';
$tar1 = '/home/nabrijan/app/app_deploy.tar.gz';
$tar2 = '/home/nabrijan/app/next_build.tar.gz';

echo "Starting extraction...\n";
if (file_exists($tar1)) {
    exec("tar -xzf $tar1 -C $appDir 2>&1", $out1, $ret1);
    echo "App extract ret: $ret1\n" . implode("\n", $out1) . "\n";
}

if (file_exists($tar2)) {
    exec("rm -rf " . escapeshellarg($appDir . '/.next') . " && tar -xzf $tar2 -C $appDir 2>&1", $out2, $ret2);
    echo "Next build extract ret: $ret2\n" . implode("\n", $out2) . "\n";
}

// Copy updated php files to public_html so Apache sees them immediately
if (file_exists($pubDir)) {
    @copy($appDir . '/check_logs.php', $pubDir . '/check_logs.php');
    @copy($appDir . '/deploy_extract.php', $pubDir . '/deploy_extract.php');
    @copy($appDir . '/extract.php', $pubDir . '/extract.php');
    @copy($appDir . '/unpacker.php', $pubDir . '/unpacker.php');
}

exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt") . " 2>&1");
echo "Done. Passenger restarted.\n";
?>
