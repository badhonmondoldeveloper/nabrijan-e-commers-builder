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

    // 4. Write valid .env file
    $envContent = "DATABASE_URL=\"mysql://nabrijan_dbuser:badhon%232006@localhost:3306/nabrijan_db\"\n"
                . "JWT_SECRET=\"super-secret-jwt-key-nabrijan-2026\"\n"
                . "NEXTAUTH_SECRET=\"super-secret-jwt-key-nabrijan-2026\"\n"
                . "NODE_ENV=\"production\"\n"
                . "PORT=3000\n";
    file_put_contents($appDir . '/.env', $envContent);
    echo "Updated .env in $appDir\n";

    // 5. Run Prisma DB Push & Seed
    $nodePath = shell_exec("which node 2>&1") ? "npx" : "/home/nabrijan/nodevenv/repositories/nabrijan/18/bin/npx";
    $prismaPush = shell_exec("cd " . escapeshellarg($appDir) . " && $nodePath prisma db push --accept-data-loss 2>&1");
    echo "Prisma DB Push:\n" . $prismaPush . "\n";

    $prismaSeed = shell_exec("cd " . escapeshellarg($appDir) . " && $nodePath prisma db seed 2>&1");
    echo "Prisma DB Seed:\n" . $prismaSeed . "\n";

    // 6. Touch restart.txt
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
