<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=160&section=header&text=WGWAnime+Server&fontSize=44&fontColor=fff&animation=twinkling&fontAlignY=38&desc=Fastify+%C2%B7+MongoDB+%C2%B7+Groq+AI&descAlignY=60&descSize=16" width="100%"/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1000&color=CE1126&center=true&vCenter=true&width=600&lines=REST+API+for+WGWAnime;JWT+Auth+%C2%B7+MongoDB+%C2%B7+Groq+AI;Serverless+on+Vercel" alt="Typing SVG" />
</a>

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat-square&logo=fastify&logoColor=white)](https://fastify.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## Overview

Backend REST API for WGWAnime. Handles authentication, watchlist tracking, reviews, social features, AI-powered anime recommendations via Groq and Cloudinary for uploading user profile image.Deployed serverless on Vercel with MongoDB Atlas.

---

## API Endpoints

### Auth `/api/auth`

| Method | Route            | Auth | Description        |
| ------ | ---------------- | ---- | ------------------ |
| POST   | `/register`      | -    | Create account     |
| POST   | `/login`         | -    | Login, returns JWT |
| GET    | `/me`            | JWT  | Get current user   |
| PATCH  | `/me`            | JWT  | Update profile     |
| PATCH  | `/upload-avatar` | JWT  | Update profile     |

### Watchlist `/api/watchlist`

| Method | Route     | Auth | Description               |
| ------ | --------- | ---- | ------------------------- |
| GET    | `/`       | JWT  | Get full watchlist        |
| GET    | `/:malId` | JWT  | Get single entry          |
| POST   | `/`       | JWT  | Add or update entry       |
| PATCH  | `/:malId` | JWT  | Update status or progress |
| DELETE | `/:malId` | JWT  | Remove entry              |

### Reviews `/api/reviews`

| Method | Route                | Auth | Description             |
| ------ | -------------------- | ---- | ----------------------- |
| GET    | `/anime/:malId`      | -    | Get reviews for anime   |
| GET    | `/anime/:malId/mine` | JWT  | Get your review         |
| POST   | `/`                  | JWT  | Create or update review |
| DELETE | `/anime/:malId`      | JWT  | Delete your review      |
| POST   | `/:reviewId/like`    | JWT  | Toggle like             |

### Social `/api/social`

| Method | Route                      | Auth | Description    |
| ------ | -------------------------- | ---- | -------------- |
| GET    | `/feed`                    | JWT  | Activity feed  |
| GET    | `/users`                   | JWT  | Search users   |
| GET    | `/users/:username`         | -    | Public profile |
| GET    | `/users/:userId/followers` | -    | Followers list |
| GET    | `/users/:userId/following` | -    | Following list |
| POST   | `/follow/:userId`          | JWT  | Follow user    |
| DELETE | `/follow/:userId`          | JWT  | Unfollow user  |

### Recommendations `/api/recommendations`

| Method | Route             | Auth | Description            |
| ------ | ----------------- | ---- | ---------------------- |
| GET    | `/`               | JWT  | AI recs from watchlist |
| GET    | `/similar/:malId` | JWT  | Similar to an anime    |
| DELETE | `/:malId`         | JWT  | Dismiss recommendation |

---

## Tech Stack

![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## Project Structure

```
backend/
├── server.js
├── vercel.json
├── package.json
├── configs/
│   ├── cloudinary.js       - cloudinary connection
│   ├── db.js               - MongoDB connection
│   └── ai.js               - Groq client + ask() helper
├── models/
│   ├── User.js
│   ├── Watchlist.js
│   ├── Review.js
│   └── Activity.js
├── middlewares/
│   └── authMiddleware.js   - JWT verification
├── controllers/
│   ├── authController.js
│   ├── watchlistController.js
│   ├── reviewController.js
│   ├── socialController.js
│   └── recommendationsController.js
└── routes/
    ├── authRoutes.js
    ├── watchlistRoutes.js
    ├── reviewRoutes.js
    ├── socialRoutes.js
    └── recommendationsRoutes.js
```

---

## Getting Started

```bash
git clone https://github.com/JOSIAHTHEPROGRAMMER/Anime-App-server
cd Anime-App-server
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development

CLOUDINARY_CLOUD=your_cloud_url
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

```bash
npm run dev
```

Server runs at `http://localhost:3000`. Hit `GET /` to confirm it's live.

---

## Deployment

Deploys as a serverless function on Vercel. The `vercel.json` routes all traffic through `server.js`.

```bash
vercel --prod
```

Set all `.env` variables in your Vercel project settings under Environment Variables.

---

## Related

- [WGWAnime Frontend](https://github.com/JOSIAHTHEPROGRAMMER/Anime-App) - Vanilla JS client
