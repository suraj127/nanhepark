Start-Sleep -Seconds 5

$body = @{
  images = @("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ==")
  location = @{
    address = "E Block, Nanhey Park, Matiala"
    latitude = 28.6083
    longitude = 77.0425
    area = "Nanhey Park"
    city = "New Delhi"
  }
  userNote = "sewer overflow garbage road broken"
} | ConvertTo-Json -Depth 5

try {
  $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/detect-issues' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 30
  Write-Output "STATUS: $($response.StatusCode)"
  $content = $response.Content
  if ($content.Length -gt 2000) {
    Write-Output $content.Substring(0, 2000)
    Write-Output "... (truncated)"
  } else {
    Write-Output $content
  }
} catch {
  Write-Output "ERROR: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Output $reader.ReadToEnd()
  }
}
