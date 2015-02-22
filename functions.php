<?php

/*
	gör flerdimensionell till en-dimensionell
*/

  function array_merge_deep($arr) { // an array-merging function to strip one or more arrays down to a single one dimension array
    $arr = (array)$arr;
    $argc = func_num_args();
    if ($argc != 1) {
      $argv = func_get_args();
      for ($i = 1; $i < $argc; $i++) $arr = array_merge($arr, (array)$argv[$i]);
    }
    $temparr = array();
    foreach($arr as $key => $value) {
      if (is_array($value)) $temparr = array_merge($temparr, array_merge_deep($value));
      else $temparr = array_merge($temparr, array($key => $value));
    }
    return $temparr;
  }
?>