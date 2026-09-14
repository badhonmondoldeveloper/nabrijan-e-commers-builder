<?php
$zipFile = '/home/nabrijan/app/deploy.zip';
$dest = '/home/nabrijan/app';

$zip = new ZipArchive();
if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo($dest);
    $zip->close();
    echo 'ZIP_EXTRACTION_SUCCESSFUL';
} else {
    echo 'ZIP_OPEN_FAILED';
}
?>