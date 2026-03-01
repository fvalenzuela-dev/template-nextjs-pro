# ==========================================
# 1. VARIABLES - AJUSTA EL NUEVO REPO
# ==========================================
PROJECT_ID="xxxxxxxx-dev-deploy"
POOL_ID="github-frontend-pol-dev"
SA_NAME="github-deploy-sa-frontend-dev" # Puedes usar la misma o una nueva
REPO_FULL_NAME="fvalenzuela-dev/NUEVO-REPOSITORIO" 

PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format='value(projectNumber)')
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# ==========================================
# 2. VINCULACIÓN DEL NUEVO REPOSITORIO
# ==========================================

# Autorizar al nuevo repositorio en el Pool existente para actuar como la SA
gcloud iam service-accounts add-iam-policy-binding ${SA_EMAIL} \
    --project=${PROJECT_ID} \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${REPO_FULL_NAME}"

# ==========================================
# 3. VERIFICACIÓN DE PERMISOS (Opcional si usas la misma SA)
# ==========================================

# Si decidiste crear una SA nueva para este repo, descomenta las siguientes líneas:
# gcloud iam service-accounts create ${SA_NAME} --project=${PROJECT_ID}
# gcloud projects add-iam-policy-binding ${PROJECT_ID} --member="serviceAccount:${SA_EMAIL}" --role="roles/run.admin"
# ... (repetir los add-iam-policy-binding del script original para la nueva SA)

echo "--------------------------------------------------------"
echo "AUTORIZACIÓN COMPLETADA PARA: ${REPO_FULL_NAME}"
echo "Usa el mismo Provider ARN en tu YAML de GitHub Actions"
echo "--------------------------------------------------------"