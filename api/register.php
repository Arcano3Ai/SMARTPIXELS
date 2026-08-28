<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);

    $fullName = $input['full_name'] ?? '';
    $company = $input['company'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($fullName) || empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Todos los campos obligatorios."]);
        exit;
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (full_name, company, email, password_hash) VALUES (?, ?, ?, ?)");
        $stmt->execute([$fullName, $company, $email, $passwordHash]);

        echo json_encode(["status" => "success", "message" => "Cuenta creada exitosamente."]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Duplicate entry
            echo json_encode(["status" => "error", "message" => "El correo ya está registrado."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error en el servidor."]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
}
?>
