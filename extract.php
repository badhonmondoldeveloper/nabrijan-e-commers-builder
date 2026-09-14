<?php
$tar = '/home/nabrijan/app/app_deploy.tar.gz';
$dest = '/home/nabrijan/app';
if (file_exists($tar)) {
    try {
        $phar = new PharData($tar);
        $phar->extractTo($dest, null, true);
        echo 'EXTRACTION_SUCCESSFUL';
    } catch (Exception $e) {
        echo 'ERR: ' . $e->getMessage();
    }
} else {
    echo 'FILE_NOT_FOUND';
}
?>