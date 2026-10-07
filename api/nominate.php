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

    $saved = false;

    // 1. Intentar guardar en Base de Datos MySQL si está disponible
    if ($pdo !== null) {
        try {
            $stmt = $pdo->prepare("INSERT INTO leads (name, email, interest, message, created_at) VALUES (?, ?, ?, ?, NOW())");
            $stmt->execute([$name, $email, $interest, $message]);
            $saved = true;
        } catch (Exception $e) {
            $saved = false;
        }
    }

    // 2. Si no hay BD o falló el insert, activar almacenamiento de respaldo (Fail-safe)
    if (!$saved) {
        $backupDir = __DIR__ . '/../data';
        if (!is_dir($backupDir)) {
            @mkdir($backupDir, 0750, true);
        }
        
        $backupFile = is_dir($backupDir) ? $backupDir . '/leads_backup.json' : __DIR__ . '/leads_backup.json';
        
        $newLead = [
            'id' => time() . '_' . rand(100, 999),
            'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            'email' => filter_var($email, FILTER_SANITIZE_EMAIL),
            'interest' => htmlspecialchars($interest, ENT_QUOTES, 'UTF-8'),
            'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
            'created_at' => date('Y-m-d H:i:s'),
            'source' => 'fallback_storage'
        ];

        $currentLeads = [];
        if (file_exists($backupFile)) {
            $content = @file_get_contents($backupFile);
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                $currentLeads = $decoded;
            }
        }
        $currentLeads[] = $newLead;
        @file_put_contents($backupFile, json_encode($currentLeads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

        // Notificación de emergencia por email a proyectos@agenteweb.com.mx
        $to = "proyectos@agenteweb.com.mx";
        $subject = "Nuevo Lead Agente Web: " . $name;
        $body = "Nuevo cliente registrado en Agente Web:\n\n"
              . "Nombre: $name\n"
              . "Email: $email\n"
              . "Interés: $interest\n"
              . "Mensaje: $message\n"
              . "Fecha: " . date('Y-m-d H:i:s') . "\n";
        $headers = "From: noreply@agenteweb.com.mx\r\n"
                 . "Reply-To: " . $email . "\r\n"
                 . "X-Mailer: PHP/" . phpversion();
        @mail($to, $subject, $body, $headers);
    }

    echo json_encode(["status" => "success", "message" => "Solicitud recibida. Te responderemos en breve."]);
} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
}
?>