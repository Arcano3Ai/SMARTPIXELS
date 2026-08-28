<?php
// Configuración de la Base de Datos
// Debes editar esto con los datos reales de tu Hostinger
$host = "localhost";
$dbname = "u123456789_arcano_db"; // Cambia esto
$username = "u123456789_admin";   // Cambia esto
$password = "TuPasswordSeguro123!"; // Cambia esto

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En producción, no mostrar el error real al usuario
    die(json_encode(["status" => "error", "message" => "Error de conexión a BD."]));
}
?>
