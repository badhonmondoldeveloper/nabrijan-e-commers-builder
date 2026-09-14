<?php
$tar = '/home/nabrijan/app/app_deploy.tar.gz';
$dest = '/home/nabrijan/app';
$pubDest = '/home/nabrijan/public_html';
if (file_exists($tar)) {
    try {
        $phar = new PharData($tar);
        $phar->extractTo($dest, null, true);
        if (file_exists($pubDest)) {
            @$phar->extractTo($pubDest, null, true);
        }
        echo 'EXTRACTION_SUCCESSFUL';
    } catch (Exception $e) {
        echo 'ERR: ' . $e->getMessage();
    }
} else {
    echo 'FILE_NOT_FOUND';
}
?>
