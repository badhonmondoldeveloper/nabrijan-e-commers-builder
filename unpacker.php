<?php
$tar1 = '/home/nabrijan/app/app_deploy.tar.gz';
$tar2 = '/home/nabrijan/app/node_modules_deploy.tar.gz';
$dest = '/home/nabrijan/app';

echo 'Starting extraction...
';
if (file_exists($tar1)) {
    exec("tar -xzf $tar1 -C $dest 2>&1", $out1, $ret1);
    echo "App extract ret: $ret1
" . implode("
", $out1) . "
";
}
if (file_exists($tar2)) {
    exec("tar -xzf $tar2 -C $dest 2>&1", $out2, $ret2);
    echo "node_modules extract ret: $ret2
" . implode("
", $out2) . "
";
}
echo "Done.";
?>