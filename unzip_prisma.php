<?php
$zipFile = '/home/nabrijan/app/prisma_fix.zip';

foreach (['/home/nabrijan/app/node_modules/.prisma/client', '/home/nabrijan/nodevenv/app/20/lib/node_modules/.prisma/client'] as $dest) {
    if (!file_exists($dest)) {
        mkdir($dest, 0755, true);
    }
    $zip = new ZipArchive();
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo($dest);
        $zip->close();
        echo "EXTRACTED TO $dest
";
    }
}
?>