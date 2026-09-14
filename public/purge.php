<?php
header("X-LiteSpeed-Purge: *");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
echo "LITESPEED_CACHE_PURGED_SUCCESSFULLY";
?>
