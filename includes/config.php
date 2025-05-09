<?php
/**
 * Configuration file for SariSari Stories
 * MySQL version
 */

// Database configuration - using MySQL
define('DB_SERVER', 'localhost');     // Change to your MySQL server address
define('DB_PORT', '3307');            // Standard MySQL port
define('DB_USERNAME', 'root');        // Change to your MySQL username
define('DB_PASSWORD', '');            // Change to your MySQL password
define('DB_NAME', 'sarisari');        // Change to your database name
define('DB_TYPE', 'mysql');           // Changed from 'pgsql' to 'mysql'

// Site configuration
define('SITE_NAME', 'SariSari Stories');
define('SITE_DESCRIPTION', 'A vibrant Filipino community platform for sharing personal narratives, hidden gems, local cuisine, events, and traditions.');
define('SITE_URL', 'http://localhost/sarisari'); // Replace with your actual URL in production

// Paths
define('ROOT_PATH', dirname(__DIR__) . '/');
define('INCLUDES_PATH', ROOT_PATH . 'includes/');
define('PUBLIC_PATH', ROOT_PATH . 'public/');
define('UPLOADS_PATH', PUBLIC_PATH . 'uploads/');

// Email Configuration
define('ADMIN_EMAIL', 'admin@sarisari-stories.com');
define('CONTACT_EMAIL', 'contact@sarisari-stories.com');

// Other settings
define('POSTS_PER_PAGE', 9);
define('ENABLE_REGISTRATION', true);

// Session timeout (in seconds)
define('SESSION_TIMEOUT', 1800); // 30 minutes

// Error reporting - set to 0 in production
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>