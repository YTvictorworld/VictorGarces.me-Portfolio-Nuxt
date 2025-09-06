# Script para desplegar archivos estáticos a una branch específica
param(
    [string]$BranchName = "gh-pages",
    [string]$CommitMessage = "Deploy static site - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "🚀 Iniciando despliegue a branch: $BranchName" -ForegroundColor Green

# 1. Generar archivos estáticos
Write-Host "📦 Generando archivos estáticos..." -ForegroundColor Yellow
pnpm generate

# 2. Verificar que existe la carpeta de salida
if (!(Test-Path ".output/public")) {
    Write-Host "❌ Error: No se encontró .output/public" -ForegroundColor Red
    exit 1
}

# 3. Guardar el branch actual
$currentBranch = git branch --show-current

# 4. Crear o cambiar a la branch de despliegue
Write-Host "🌿 Cambiando a branch: $BranchName" -ForegroundColor Yellow
git checkout -B $BranchName

# 5. Limpiar el branch (mantener solo .git)
Write-Host "🧹 Limpiando archivos existentes..." -ForegroundColor Yellow
git rm -rf . --ignore-unmatch
Remove-Item * -Recurse -Force -Exclude .git -ErrorAction SilentlyContinue

# 6. Copiar archivos estáticos
Write-Host "📂 Copiando archivos estáticos..." -ForegroundColor Yellow
Copy-Item ".output/public/*" . -Recurse -Force

# 7. Crear .gitignore específico para static
@"
# Static site deployment branch
# Only contains generated files
node_modules/
.nuxt/
.output/
"@ | Out-File -FilePath ".gitignore" -Encoding utf8

# 8. Agregar y commitear
Write-Host "💾 Agregando archivos al git..." -ForegroundColor Yellow
git add .
git commit -m $CommitMessage

# 9. Push a la branch remota
Write-Host "⬆️ Haciendo push a origin/$BranchName..." -ForegroundColor Yellow
git push -f origin $BranchName

# 10. Volver al branch original
Write-Host "🔙 Volviendo a branch: $currentBranch" -ForegroundColor Yellow
git checkout $currentBranch

Write-Host "✅ ¡Despliegue completado exitosamente!" -ForegroundColor Green
Write-Host "📍 Los archivos están en: origin/$BranchName" -ForegroundColor Cyan
