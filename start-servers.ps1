# Start React server
Start-Process powershell -ArgumentList "npm start"

# Navigate to backend directory and start Flask server
Set-Location -Path ".\backend"
$env:FLASK_APP = "flask_api.py"
flask run
