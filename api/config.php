<?php
// Configuración de la Base de Datos
// Debes editar esto con los datos reales de tu Hostinger
$host = "localhost";
$dbname = "u123456789_arcano_db"; // Cambia esto
$username = "u123456789_admin";   // Cambia esto
$password = "TuPasswordSeguro123!"; // Cambia esto

$pdo = null;
$dbError = null;

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    // Si la BD falla o no esta configurada, no abortamos inmediatamente con die()
    // para permitir que los endpoints ejecuten mecanismos de rescate/fallback.
    $pdo = null;
    $dbError = $e->getMessage();
}
?>
