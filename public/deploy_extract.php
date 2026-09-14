<?php
header('Content-Type: text/plain');
header('X-LiteSpeed-Purge: *');

// Self-update deploy_extract.php if running old version on server
$selfUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/public/deploy_extract.php?v=' . time();
$latestScript = @file_get_contents($selfUrl);
if ($latestScript && strpos($latestScript, 'REMOVING STALE OVERRIDES') !== false) {
    $currentScript = @file_get_contents(__FILE__);
    if (sha1($currentScript) !== sha1($latestScript)) {
        file_put_contents(__FILE__, $latestScript);
        echo "Updated deploy_extract.php to latest version from GitHub. Executing fresh script...\n\n";
        eval('?>' . $latestScript);
        exit;
    }
}

echo "=== FINDING ALL PACKAGE.JSON FILES IN /home/nabrijan ===\n";
echo shell_exec("find /home/nabrijan -name package.json -not -path '*/node_modules/*' 2>/dev/null");
echo "\n";

$githubUrl = 'https://raw.githubusercontent.com/badhonmondoldeveloper/nabrijan-e-commers-builder/main/next_build.tar.gz?v=' . time();
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
    $npxBin = '/home/nabrijan/nodevenv/repositories/nabrijan/18/bin/npx';
    if (!file_exists($npxBin)) {
        $npxBin = '/home/nabrijan/nodevenv/app/18/bin/npx';
    }
    if (!file_exists($npxBin)) {
        $npxBin = trim(shell_exec('find /home/nabrijan/nodevenv -name npx 2>/dev/null | head -n 1'));
    }
    if ($npxBin) {
        $prismaPush = shell_exec("cd " . escapeshellarg($appDir) . " && $npxBin prisma db push --accept-data-loss 2>&1");
        echo "Prisma DB Push ($npxBin):\n" . $prismaPush . "\n";

        $prismaSeed = shell_exec("cd " . escapeshellarg($appDir) . " && $npxBin prisma db seed 2>&1");
        echo "Prisma DB Seed ($npxBin):\n" . $prismaSeed . "\n";
    } else {
        echo "npx binary not found in nodevenv\n";
    }

    // 6. Touch restart.txt
    shell_exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt"));
    echo "Touched $appDir/tmp/restart.txt\n\n";
}

echo "=== REMOVING STALE OVERRIDES IN PUBLIC_HTML ===\n";
$pubDir = '/home/nabrijan/public_html';
echo "Files in $pubDir:\n" . shell_exec("ls -la " . escapeshellarg($pubDir)) . "\n";

echo "=== REMOVING STALE STATIC OVERRIDES IN PUBLIC_HTML ===\n";
$pubDir = '/home/nabrijan/public_html';
echo "Files in $pubDir:\n" . shell_exec("ls -la " . escapeshellarg($pubDir)) . "\n";

$items = glob($pubDir . '/*');
$allowedFiles = ['deploy_extract.php', 'cgi-bin', '.htaccess', 'images'];
foreach ($items as $item) {
    $base = basename($item);
    if (!in_array($base, $allowedFiles)) {
        shell_exec("rm -rf " . escapeshellarg($item));
        echo "Cleaned static override: $base\n";
    }
}
echo "Cleaned public_html directory successfully.\n";

echo "\n=== RESTARTING NODE PROCESSES & PURGING ALL CACHES ===\n";
shell_exec("pkill -9 -f node 2>&1");
shell_exec("pkill -9 -f passenger 2>&1");

// Clean tmp directories
@shell_exec("rm -rf /home/nabrijan/tmp/* 2>&1");
@shell_exec("rm -rf /tmp/passenger.* 2>&1");

foreach ($appDirs as $appDir) {
    if (file_exists($appDir)) {
        shell_exec("mkdir -p " . escapeshellarg($appDir . "/tmp") . " && touch " . escapeshellarg($appDir . "/tmp/restart.txt"));
        echo "Touched $appDir/tmp/restart.txt\n";
    }
}

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
