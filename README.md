# MERN Image CRUD

A MERN Image CRUD application with Cloudinary image storage, MongoDB persistence, image preview, search, edit, delete, and responsive UI.

## Project structure

```text
mern-project/
├── backend/
└── frontend/
```

## Requirements

- Node.js 18+
- MongoDB Community Server or MongoDB Atlas
- Cloudinary account
- GitHub account
- Railway account
- Vercel account

## 1. Cloudinary — Image Storage

Create a Cloudinary account and copy:

- Cloud Name
- API Key
- API Secret

Install backend packages:

```bash
cd backend
npm install
```

The backend uses `multer.memoryStorage()` and uploads the received image buffer to Cloudinary.

Set these variables in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Images are stored in the Cloudinary `image-crud` folder.

## 2. Run locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Example `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/image_crud_db
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Frontend

Open another CMD:

```bash
cd frontend
npm install
npm run dev
```

Vite normally runs at:

```text
http://localhost:5173
```

## 3. GitHub

Push the **parent folder** containing both `backend` and `frontend` to GitHub.

The repository must keep this structure:

```text
mern-project/
├── backend/
└── frontend/
```

Do not commit:

- `node_modules/`
- `.env`
- `dist/`

The root and backend/frontend `.gitignore` files are configured for this.

## 4. MongoDB Atlas

Create a free M0 cluster.

Under **Database Access**, create a database user.

Under **Network Access**, allow your development/deployment IP as needed. For a simple deployment setup, MongoDB Atlas can use:

```text
0.0.0.0/0
```

Copy the Drivers connection string and put it in Railway as:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

## 5. Railway — Backend

Create a Railway project and deploy the GitHub repository.

If Railway asks for a root directory, select:

```text
/backend
```

Add these variables in Railway:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=https://your-frontend.vercel.app
```

`server.js` uses `process.env.PORT`, so Railway's dynamically assigned port is respected automatically.

After deployment, copy the Railway backend URL, for example:

```text
https://your-backend.up.railway.app
```

Test:

```text
https://your-backend.up.railway.app/
```

Expected response contains:

```text
Image CRUD API is running.
```

## 6. Vercel — Frontend

Import the same GitHub repository into Vercel.

If the frontend is in a subfolder, set **Root Directory** to:

```text
frontend
```

Vercel should auto-detect Vite.

Add this environment variable:

```text
VITE_BASE_URL=https://your-backend.up.railway.app
```

> Vite exposes client-side environment variables through the `VITE_` prefix. The frontend `api.js` therefore uses `VITE_BASE_URL` rather than the reserved `BASE_URL` name.

Redeploy the frontend after adding the variable.

## API

- `POST /api/images`
- `GET /api/images`
- `GET /api/images/:id`
- `PUT /api/images/:id`
- `DELETE /api/images/:id`

## Image storage

Images are uploaded directly to Cloudinary. MongoDB stores:

- `title`
- `description`
- `imageUrl`
- `publicId`
- `createdAt`
- `updatedAt`

Updating an image deletes the previous Cloudinary asset before saving the new one.

Deleting an image removes both its Cloudinary asset and MongoDB record.
