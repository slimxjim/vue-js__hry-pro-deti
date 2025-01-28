<?php
// Allow CORS from any domain (replace * with your front-end URL for security in production)
header("Access-Control-Allow-Origin: *");  // Replace '*' with the specific frontend domain (e.g., 'http://localhost:4001')
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, DELETE, UPDATE, OPTIONS, TRACE");  // Allow methods like POST, GET, etc.
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Allow headers, including content-type and authorization headers

// Handle the preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);  // Respond with 200 OK for OPTIONS request
    exit();  // Exit after sending the response
}
?>
