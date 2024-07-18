<!-- Hallo, {{$employee['username']}} {{ $employee['name']}} <br>

Wir freuen uns, Ihnen mitteilen zu können, dass ein neuer Termin für eine Pflegeberatung erfolgreich gebucht wurde. Hier sind die Details des Termins zur Überprüfung:
<br>
Patientenname: {{$patient['username']}} {{ $patient['name'] }}
<br>
Datum: {{ $reservation['date'] }}
<br>
Uhrzeit: {{ $reservation['hour'] }}
<br>
Bitte stellen Sie sicher, dass Sie alle notwendigen Vorbereitungen für die Beratung treffen und etwaige Unterlagen bereithalten. Sollten Sie Fragen haben oder weitere Informationen benötigen, stehen wir Ihnen jederzeit zur Verfügung.
<br>
Wir bedanken uns für Ihre kontinuierliche Unterstützung und freuen uns auf eine erfolgreiche Beratungssitzung.
<br>
Mit freundlichen Grüßen,
das Buchungssystem von VIP-VITALISTEN.DE -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <h1>Neue Buchung für Pflegeberatung</h1>
        <!-- design a better looking  -->
        <p>
            Hello, {{$employee['username']}} {{ $employee['name']}} <br>
        </p>
        <!-- make a table with the content -->
        <table>
            <tr>
                <td>Patientenname:</td>
                <td>{{$patient['username']}} {{ $patient['name'] }}</td>
            </tr>
            <tr>
                <td>Datum:</td>
                <td>{{ $reservation['date'] }}</td>
            </tr>
            <tr>
                <td>Uhrzeit:</td>
                <td>{{ $reservation['hour'] }}</td>
            </tr>
        </table>

        <p>
            Bitte stellen Sie sicher, dass Sie alle notwendigen Vorbereitungen für die Beratung treffen und etwaige Unterlagen bereithalten. Sollten Sie Fragen haben oder weitere Informationen benötigen, stehen wir Ihnen jederzeit zur Verfügung.
        </p>
        <p>
            Wir bedanken uns für Ihre kontinuierliche Unterstützung und freuen uns auf eine erfolgreiche Beratungssitzung.
        </p>
        <p>
            Mit freundlichen Grüßen,
            das Buchungssystem von VIP-VITALISTEN.DE
        </p>
    </div>

</body>
</html>
