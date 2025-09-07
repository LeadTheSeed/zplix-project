<?php
// Version
define('VERSION', '4.0.2.3');

// Salati E-commerce Platform
define('SALATI_VERSION', '1.0.0');
define('SALATI_REGION', 'Middle East');
define('SALATI_DEFAULT_CURRENCY', 'USD');

// Configuration
if (is_file('config.php')) {
	require_once('config.php');
}

// Install
if (!defined('DIR_APPLICATION')) {
	header('Location: install/index.php');
	exit();
}

// Startup
require_once(DIR_SYSTEM . 'startup.php');

// Framework
require_once(DIR_SYSTEM . 'framework.php');
