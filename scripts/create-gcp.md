# ==========================================
# 1. VARIABLES - CONFIGURA ESTO
# ==========================================
PROJECT_ID="xxxxx-xxxxxx-xxxxx"
REGION="us-central1"
POOL_ID="github-frontend-pool"
PROVIDER_ID="github-frontend-provider"
REPO_FULL_NAME="fvalenzuela-dev/template-nextjs-pro"
SA_NAME="github-deploy-prod-sa" 
REPO_ARTIFACT="app-frontend-react-repo"

# ==========================================
# 2. EJECUCIÓN DE COMANDOS
# ==========================================

# Crear la Service Account
gcloud iam service-accounts create ${SA_NAME} --project=${PROJECT_ID}

# Crear el Workload Identity Pool
gcloud iam workload-identity-pools create ${POOL_ID} \
    --location="global" --project=${PROJECT_ID}

# Crear el Provider OIDC con filtro de seguridad por Owner
gcloud iam workload-identity-pools providers create-oidc ${PROVIDER_ID} \
    --location="global" \
    --workload-identity-pool=${POOL_ID} \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
    --attribute-condition="attribute.repository_owner == 'fvalenzuela-dev'" \
    --project=${PROJECT_ID}

# Vincular la Service Account específicamente al repositorio de GitHub
PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format='value(projectNumber)')

gcloud iam service-accounts add-iam-policy-binding ${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${REPO_FULL_NAME}" \
    --project=${PROJECT_ID}

# Crear el repositorio en Artifact Registry
gcloud artifacts repositories create ${REPO_ARTIFACT} \
    --repository-format=docker --location=${REGION} --project=${PROJECT_ID}

# Asignar permisos de escritura en el Registry a la Service Account
gcloud artifacts repositories add-iam-policy-binding ${REPO_ARTIFACT} \
    --location=${REGION} \
    --member="serviceAccount:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer" \
    --project=${PROJECT_ID}

# ==========================================
# 3. DATOS PARA TU YAML DE GITHUB
# ==========================================
echo "--------------------------------------------------------"
echo "COPIA ESTOS VALORES EN TU GITHUB ACTIONS:"
echo "workload_identity_provider: projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}"
echo "service_account: ${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
echo "--------------------------------------------------------"