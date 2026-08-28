<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Leer JSON de entrada (si viene de fetch) o POST normal
    $input = json_decode(file_get_contents('php://input'), true);

    $name = $input['name'] ?? $_POST['name'] ?? '';
    $email = $input['email'] ?? $_POST['email'] ?? '';
    $interest = $input['interest'] ?? $_POST['interest'] ?? 'General';
    $message = $input['message'] ?? $_POST['message'] ?? '';

    // Validación básica
    if (empty($name) || empty($email)) {
        echo json_encode(["status" => "error", "message" => "Nombre y Correo requeridos."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO leads (name, email, interest, message, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $email, $interest, $message]);

        echo json_encode(["status" => "success", "message" => "Solicitud recibida. Te contactaremos pronto."]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Error al guardar."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
}
?>