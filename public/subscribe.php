<?php
// Include configuration and functions
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/auth.php';

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set header to return JSON
header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Get email from request
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';

if (empty($email)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email is required'
    ]);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format'
    ]);
    exit;
}

// Subscribe to newsletter
$result = subscribe_newsletter($email);

if (!$result) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to subscribe. Please try again.'
    ]);
    exit;
}

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Thank you for subscribing!'
]);
