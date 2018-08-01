<?php
// for testing.

require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\VideoGrant;

// Authentication values
$twilioAccountSid = getenv('ACCOUNT_SID');           // starts with "AC".
$twilioApiKey = getenv('VIDEO_API_KEY');             // starts with "SK".
$twilioApiSecret = getenv('VIDEO_API_KEY_SECRET');

// A unique identifier for this user
$identity = getenv('VIDEO_USER_ID');
// The specific Room we'll allow the user to access
$roomName = getenv('VIDEO_ROOM');

// Create access token, which we will serialize and send to the client
$token = new AccessToken($twilioAccountSid, $twilioApiKey, $twilioApiSecret, 3600, $identity);
$videoGrant = new VideoGrant();
$videoGrant->setRoom($roomName);
$token->addGrant($videoGrant);
?>
Token: <?php echo $token; ?>