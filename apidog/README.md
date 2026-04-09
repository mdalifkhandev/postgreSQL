# Apidog Import Guide

## Files

- `openapi.json`: Import this into Apidog as an OpenAPI project.
- `environment.json`: Reference values you can copy into an Apidog environment.

## How to import

1. Start the backend:

   ```bash
   npm run dev
   ```

2. Open Apidog.
3. Choose import option for `OpenAPI/Swagger`.
4. Select `apidog/openapi.json`.
5. Create an environment and copy values from `apidog/environment.json`.
6. Login once. The backend now sets the JWT in a cookie automatically, so protected requests can work without manually pasting the token if Apidog keeps cookies enabled.

## Recommended test flow

1. `GET /api/health`
2. `POST /api/auth/register`
3. `POST /api/auth/login`
4. Let Apidog store the `token` cookie automatically
5. Call protected routes directly
6. Test `GET /api/auth/me`
7. Test `GET /api/users/profile`
8. Login with admin user and test `GET /api/users`

## If Apidog still does not reuse the token

1. Open the `POST /api/auth/login` request.
2. Save the `token` from the JSON response into the environment variable named `token`.
3. In protected requests, set header `Authorization: Bearer {{token}}`.
4. Keep cookies enabled as the first option, and use the header fallback only if Apidog does not persist cookies.

## Default admin

- Email: `admin@example.com`
- Password: `admin123`
