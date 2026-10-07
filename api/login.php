<?php
require_once 'config.php';
session_start();

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);

    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Credenciales requeridas."]);
        exit;
    }

    if ($pdo === null) {
        echo json_encode(["status" => "error", "message" => "El portal de clientes está en mantenimiento temporal. Contáctanos por WhatsApp."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, full_name, password_hash, role FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password_hash'])) {
            // Session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name'] = $user['full_name'];
            $_SESSION['role'] = $user['role'];

            echo json_encode(["status" => "success", "redirect" => "portal/dashboard.php"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Credenciales inválidas."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error de conexión."]);
    }
}
?>