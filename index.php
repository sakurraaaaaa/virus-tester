<?php
// WARNING: This code is intentionally vulnerable to Local File Inclusion (LFI)
// We are building this for ethical hacking training only.

$title = "NEURALNET BOARD v1.0 [Windows XP Classic]";

// The VULNERABILITY is right here.
// It takes 'page' from the URL and blindly includes it.
if (isset($_GET['page'])) {
    $title = "WARNING: SERVER_SIDE_OVERRIDE ACTIVE";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?php echo $title; ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="xp-taskbar">
        <div id="start-button">Start</div>
        <div class="taskbar-item">NeuralNet v1.0</div>
    </div>

    <div class="window">
        <div class="title-bar">
            <div class="title-bar-text">NeuralNet_XP_Board</div>
            <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
            </div>
        </div>
        <div class="window-body">
            <h1 class="marquee">Welcome to the Intentionally Vulnerable Site</h1>
            <p class="blink">STATUS: [VULNERABLE]</p>
            <p>Welcome, User. This site uses a classic PHP include mechanism.</p>
            <p>Example URL: <code>index.php?page=home</code></p>
            <hr>
            <div id="content">
                <?php
                    // This is the flaw. It does no checks on what $page is.
                    $page = isset($_GET['page']) ? $_GET['page'] : 'home.php';
                    include($page); 
                ?>
            </div>
        </div>
    </div>
</body>
</html>
