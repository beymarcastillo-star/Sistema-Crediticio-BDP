2. Configurar el Backend
cd "SISTEMA WEB/bdp-plataforma/backend"
npm install
Crear el archivo .env en la carpeta backend/ con el siguiente contenido:

PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bdp_creditos
DB_USER=postgres
DB_PASSWORD=tu_contraseña
JWT_SECRET=clave_secreta_muy_larga
NODE_ENV=development

npm run dev
# El backend corre en http://localhost:3001
3. Configurar el Frontend
cd "SISTEMA WEB/bdp-plataforma/frontend"
npm install
npm run dev
# El frontend corre en http://localhost:5173
4. Credenciales de prueba
Email:    analista@bdp.bo
Password: password
