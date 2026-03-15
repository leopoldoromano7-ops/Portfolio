# Brevo Setup

Usa Brevo via SMTP con il backend PHP gia` presente nel progetto.

## Valori da usare

```php
'host' => 'smtp-relay.brevo.com',
'port' => 587,
'encryption' => '',
'username' => 'IL_TUO_LOGIN_BREVO',
'password' => 'LA_TUA_SMTP_KEY_BREVO',
'to' => 'leopoldoromano7@gmail.com',
'from_email' => 'MITTENTE_VERIFICATO_SU_BREVO',
'from_name' => 'Portfolio Leopoldo Romano',
```

## Passi su Brevo

1. Crea un account Brevo.
2. Vai in `Settings > Senders, Domains & Dedicated IPs` e verifica il mittente che vuoi usare in `from_email`.
3. Vai in `SMTP & API` e crea una `SMTP key`.
4. Inserisci login Brevo, SMTP key e mittente verificato in `forms/mailer-config.php`.

## Note

- `username` e `from_email` non devono per forza essere uguali.
- `from_email` deve essere verificata in Brevo.
- `password` non e` la password del tuo account: e` la SMTP key di Brevo.
