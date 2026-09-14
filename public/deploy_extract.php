<?php
header('Content-Type: text/plain');
header('X-LiteSpeed-Purge: *');

$githubUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz';
$appDirs = ['/home/nabrijan/app', '/home/nabrijan/repositories/nabrijan'];

foreach ($appDirs as $appDir) {
    if (!file_exists($appDir)) continue;
    echo "=== UPDATING APP IN: $appDir ===\n";
    $targetTar = $appDir . '/next_build.tar.gz';
    
    // 1. Download build tarball
    shell_exec("curl -s -L -o " . escapeshellarg($targetTar) . " " . escapeshellarg($githubUrl));
    echo "Downloaded tarball to $targetTar (" . (file_exists($targetTar) ? filesize($targetTar) : 0) . " bytes)\n";
    
    // 2. Extract build
    if (file_exists($targetTar) && filesize($targetTar) > 1000) {
        shell_exec("rm -rf " . escapeshellarg($appDir . '/.next') . " && cd " . escapeshellarg($appDir) . " && tar -xzf " . escapeshellarg($targetTar) . " && rm -f " . escapeshellarg($targetTar));
        echo "Extracted .next build into $appDir\n";
    }

    // 3. Git pull source code
    $gitRes = shell_exec("cd " . escapeshellarg($appDir) . " && git status 2>&1 && git pull origin main 2>&1");
    echo "Git pull:\n" . $gitRes . "\n";

    // 4. Check .env
    if (file_exists($appDir . '/.env')) {
        echo ".env EXISTS in $appDir:\n";
        $envLines = file($appDir . '/.env');
        foreach ($envLines as $line) {
            if (strpos($line, 'DATABASE_URL') !== false) {
                echo "DATABASE_URL: " . substr($line, 0, 40) . "... [len: " . strlen($line) . "]\n";
            }
        }
    } else {
        echo "NO .env file in $appDir!\n";
    }

    // 5. Touch restart.txt
    shell_exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt"));
    echo "Touched $appDir/tmp/restart.txt\n\n";
}

echo "=== REMOVING STALE OVERRIDES IN PUBLIC_HTML ===\n";
$pubDir = '/home/nabrijan/public_html';
$staleDirs = [$pubDir . '/index.html', $pubDir . '/index', $pubDir . '/pricing.html', $pubDir . '/pricing'];
foreach ($staleDirs as $sd) {
    if (file_exists($sd)) {
        shell_exec("rm -rf " . escapeshellarg($sd));
        echo "Removed override: " . $sd . "\n";
    }
}

echo "\n=== RESTARTING NODE PROCESSES & PURGING LITESPEED CACHE ===\n";
shell_exec("pkill -9 -f node 2>&1");

$htaccessPath = '/home/nabrijan/public_html/.htaccess';
$htaccessRule = "\n<IfModule LiteSpeed>\n    CacheLookup off\n    CacheDisable public /\n</IfModule>\n";
if (file_exists($htaccessPath)) {
    $currentHt = file_get_contents($htaccessPath);
    if (strpos($currentHt, 'CacheLookup off') === false) {
        file_put_contents($htaccessPath, $currentHt . $htaccessRule);
        echo "Added LiteSpeed cache bypass to .htaccess\n";
    }
}
echo "Sent X-LiteSpeed-Purge: * header. Deployment complete!\n";
?>
