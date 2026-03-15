<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/../vendor/autoload.php';

header('Content-Type: application/json; charset=UTF-8');

const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 5000;

function respond(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_input(string $value): string
{
    return trim(str_replace(["\r", "\n"], [' ', ' '], $value));
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function config_string(array $config, string $key): string
{
    return trim((string)($config[$key] ?? ''));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, [
        'success' => false,
        'message' => 'Metodo non consentito.'
    ]);
}

$configPath = __DIR__ . '/mailer-config.php';
if (!file_exists($configPath)) {
    respond(500, [
        'success' => false,
        'message' => 'Configurazione mail non trovata.'
    ]);
}

$config = require $configPath;

$host = config_string($config, 'host');
$username = config_string($config, 'username');
$password = (string)($config['password'] ?? '');
$to = config_string($config, 'to');
$fromEmail = config_string($config, 'from_email');
$fromName = config_string($config, 'from_name');
$encryption = strtolower(config_string($config, 'encryption'));
$port = (int)($config['port'] ?? 587);

if ($host === '' || $username === '' || $to === '' || $fromEmail === '') {
    respond(500, [
        'success' => false,
        'message' => 'Configurazione email incompleta. Controlla forms/mailer-config.php.'
    ]);
}

if ($password === '' || str_contains($password, 'CHANGE_ME')) {
    respond(500, [
        'success' => false,
        'message' => 'Inserisci una password SMTP valida in forms/mailer-config.php. Se usi Brevo, inserisci la SMTP key.'
    ]);
}

if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
    respond(500, [
        'success' => false,
        'message' => 'Mittente o destinatario email non validi nella configurazione.'
    ]);
}

$honeypot = trim((string)($_POST['company'] ?? ''));
if ($honeypot !== '') {
    respond(200, [
        'success' => true,
        'message' => 'Messaggio inviato.'
    ]);
}

$name = clean_input((string)($_POST['name'] ?? ''));
$email = clean_input((string)($_POST['email'] ?? ''));
$subject = clean_input((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    respond(422, [
        'success' => false,
        'message' => 'Compila tutti i campi richiesti.'
    ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, [
        'success' => false,
        'message' => 'Inserisci un indirizzo email valido.'
    ]);
}

if (text_length($name) > MAX_NAME_LENGTH) {
    respond(422, [
        'success' => false,
        'message' => 'Il nome e troppo lungo.'
    ]);
}

if (text_length($subject) > MAX_SUBJECT_LENGTH) {
    respond(422, [
        'success' => false,
        'message' => 'L\'oggetto e troppo lungo.'
    ]);
}

if (text_length($message) > MAX_MESSAGE_LENGTH) {
    respond(422, [
        'success' => false,
        'message' => 'Il messaggio supera la lunghezza massima consentita.'
    ]);
}

$normalizedMessage = str_replace(["\r\n", "\r"], "\n", $message);
$mailBody = implode("\n", [
    'Nuovo messaggio dal portfolio di Leopoldo Romano',
    '',
    'Nome: ' . $name,
    'Email: ' . $email,
    'Oggetto: ' . $subject,
    '',
    'Messaggio:',
    $normalizedMessage,
]);

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $username;
    $mail->Password = $password;
    $mail->Port = $port;
    $mail->Timeout = 15;
    $mail->CharSet = 'UTF-8';

    if ($encryption === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($encryption === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mail->SMTPAutoTLS = true;
        $mail->SMTPSecure = '';
    }

    $mail->setFrom(
        $fromEmail,
        $fromName !== '' ? $fromName : 'Portfolio Leopoldo Romano'
    );
    $mail->addAddress($to);
    $mail->addReplyTo($email, $name);
    $mail->Subject = 'Portfolio Contact - ' . $subject;
    $mail->Body = $mailBody;
    $mail->AltBody = $mailBody;

    $mail->send();
} catch (Exception $exception) {
    respond(500, [
        'success' => false,
        'message' => 'Invio non riuscito: ' . $mail->ErrorInfo
    ]);
}

respond(200, [
    'success' => true,
    'message' => 'Messaggio inviato correttamente.'
]);
