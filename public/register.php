<?php
// Include configuration and functions
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/auth.php';

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Redirect if already logged in
if (is_logged_in()) {
    header('Location: /');
    exit;
}

// Initialize variables
$username = '';
$email = '';
$full_name = '';
$error = '';
$success = false;
$redirect = isset($_GET['redirect']) ? $_GET['redirect'] : '/';

// Process registration form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form inputs
    $username = sanitize($_POST['username']);
    $email = sanitize($_POST['email']);
    $full_name = sanitize($_POST['full_name']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate inputs
    if (empty($username) || empty($email) || empty($full_name) || empty($password) || empty($confirm_password)) {
        $error = 'All fields are required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email format';
    } elseif (strlen($password) < 8) {
        $error = 'Password must be at least 8 characters long';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match';
    } else {
        // Attempt to register user
        $result = register_user($username, $email, $password, $full_name);
        
        if (is_numeric($result)) {
            // Success - get user data and start session
            $user = get_user($result);
            if ($user) {
                start_session($user);
                
                // Redirect to requested page or home
                $redirect = isset($_POST['redirect']) ? $_POST['redirect'] : '/';
                header("Location: $redirect");
                exit;
            } else {
                $success = true; // Registration successful but auto-login failed
            }
        } else {
            // Error - display message
            $error = $result;
        }
    }
}

// Page title
$page_title = 'Register - ' . SITE_NAME;

// Additional head content
$additional_head = <<<HTML
<style>
    body {
        background-color: var(--bg-light);
        background-image: url('https://www.transparenttextures.com/patterns/rice-paper-3.png');
    }
</style>
HTML;

// Include header (minimal version for auth pages)
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo $page_title; ?></title>
  <meta name="description" content="<?php echo SITE_DESCRIPTION; ?>">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <?php echo $additional_head; ?>
</head>
<body>
  <div class="auth-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-form" style="max-width: 500px;">
          <div class="logo" style="justify-content: center; margin-bottom: 20px;">
            <a href="/">
              <span>SariSari Stories</span>
            </a>
          </div>
          
          <h2>Create an Account</h2>
          
          <?php if (!empty($error)): ?>
            <div class="error" style="text-align: center; margin-bottom: 15px; color: #e74c3c;">
              <?php echo $error; ?>
            </div>
          <?php endif; ?>
          
          <?php if ($success): ?>
            <div class="success" style="text-align: center; margin-bottom: 15px; color: #27ae60;">
              Registration successful! You can now <a href="/login.php">login</a>.
            </div>
          <?php else: ?>
            <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
              <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($redirect); ?>">
              
              <div class="form-row">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($username); ?>" required>
                </div>
                
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required>
                </div>
              </div>
              
              <div class="form-group">
                <label for="full_name">Full Name</label>
                <input type="text" id="full_name" name="full_name" value="<?php echo htmlspecialchars($full_name); ?>" required>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" id="password" name="password" required>
                  <small>At least 8 characters</small>
                </div>
                
                <div class="form-group">
                  <label for="confirm_password">Confirm Password</label>
                  <input type="password" id="confirm_password" name="confirm_password" required>
                </div>
              </div>
              
              <div class="form-group">
                <button type="submit" class="primary-btn" style="width: 100%;">Register</button>
              </div>
              
              <div class="auth-links">
                <p>Already have an account? <a href="login.php<?php echo !empty($redirect) && $redirect != '/' ? '?redirect=' . urlencode($redirect) : ''; ?>">Login</a></p>
              </div>
            </form>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>
  
  <script src="js/main.js"></script>
</body>
</html>
