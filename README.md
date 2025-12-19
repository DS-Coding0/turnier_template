# TurnierManager 🏆

**Ein vollständiges Turniersystem mit Node.js, React, MariaDB & Docker (Apache2 Frontend)**

[![Status](https://img.shields.io/badge/status-planning-blue.svg)](https://github.com/yourusername/turniermanager)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://docker.com)
[![MariaDB](https://img.shields.io/badge/MariaDB-relational-orange.svg)](https://mariadb.org)
[![Apache2](https://img.shields.io/badge/Apache2-Frontend-green.svg)](https://httpd.apache.org)

---

## ✨ Features

* 👤 **User Management**: Registrierung, Login, Admin/Spieler-Rollen (JWT)
* 🏟️ **Turnierverwaltung**: Admin-CRUD, verschiedene Modi (KO, Round Robin)
* 🌳 **Automatische Turnierbäume**: K.O.-Brackets mit autom. Paarung & Ergebnisberechnung
* 📝 **Spieler-Registrierung**: Anmeldung zu Turnieren
* 💬 **Echtzeit-Nachrichten**: Socket.IO Chat (Turnier- & User-Channels)
* 🐳 **Docker-Deploy**: Multi-Container (Backend + Apache2 Frontend)
* 🛡️ **Production-Ready**: Rate-Limiting, Validation, HTTPS-ready

---

## 🛠 Tech Stack

| Komponente     | Technologie                                     |
| -------------- | ----------------------------------------------- |
| **Backend**    | Node.js 20+, Express, Sequelize, Socket.IO, JWT |
| **Frontend**   | React 18+, Vite, Material-UI, React Query       |
| **Database**   | MariaDB (extern, feste Verbindung)              |
| **Webserver**  | Apache2 (Docker)                                |
| **Deployment** | Docker Compose, PM2                             |

---

## 🚀 Sofortiger Start

### Voraussetzungen

* Docker & Docker Compose
* Externe MariaDB (bereits eingerichtet)

### 1. Klonen & Setup

```bash
git clone https://github.com/yourusername/turniermanager.git
cd turniermanager
cp .env.example .env
```

> Passe die **DB_CREDENTIALS** in der `.env` an (deine MariaDB-Daten).

### 2. Starten (Ein Kommando!)

```bash
docker-compose up --build
```

### 3. Zugriff

* **Frontend**: [http://localhost](http://localhost)
* **Backend API**: [http://localhost:3001](http://localhost:3001)
* **Admin Login**: Erstelle den ersten Admin-User über `/api/auth/register`

---

## 📁 Projektstruktur

```text
turnier-project/
├── docker-compose.yml        # Multi-Container Orchestrierung
├── .env                      # DB-Credentials (extern MariaDB)
├── turnier-backend/          # Node.js API
│   ├── models/               # Sequelize Models
│   ├── routes/               # API Endpoints
│   ├── config/               # database.js
│   ├── Dockerfile
│   └── server.js
├── turnier-frontend/         # React SPA
│   ├── src/
│   │   ├── components/       # UI Komponenten
│   │   ├── contexts/         # AuthContext
│   │   └── pages/            # Seiten
│   ├── Dockerfile
│   └── apache.conf           # Apache2 Proxy Config
└── README.md
```

---

## 🔌 API Dokumentation

### Auth

* `POST /api/auth/register`

  ```json
  { "name": "Max", "email": "max@test.com", "password": "pass123" }
  ```
* `POST /api/auth/login`

  ```json
  { "email": "max@test.com", "password": "pass123" }
  ```

  → `{ "token", "user" }`
* `GET /api/auth/me` → JWT erforderlich

### Tournaments (Admin-only CRUD)

* `GET /api/tournaments`
* `GET /api/tournaments/:id`
* `POST /api/tournaments`

  ```json
  { "title": "WM 2025", "mode": "KO", "max_players": 16 }
  ```
* `POST /api/tournaments/:id/register`
* `POST /api/tournaments/:id/generate-bracket`

### Matches

* `GET /api/tournaments/:id/matches`
* `POST /api/matches/:id/result`

  ```json
  { "score_a": 3, "score_b": 1 }
  ```

### Socket.IO Events

* `join:channel:tournament:123`
* `message:tournament:123`
* `match:updated:456`

---

## 🗄 Datenbankschema

**MariaDB Tabellen**:

* `users`
* `tournaments`
* `registrations`
* `matches`
* `messages`

> Das vollständige Schema wird über **Sequelize Migrationen** erstellt.
>
> * 5 Tabellen mit Foreign Keys, Indexen und ENUMs
> * Details in `turnier-backend/migrations/`

---

## 📅 Entwicklung & Deployment

### Development

```bash
docker-compose up                 # Hot-Reload Backend
docker-compose up --build        # Rebuild Frontend
docker-compose logs -f           # Logs verfolgen
docker-compose down              # Stoppen
```

### Production

```bash
docker-compose up -d             # Detached Mode
docker-compose logs backend      # Backend Logs
docker-compose restart           # Restart Services
```

### Umgebungen

| Mode     | docker-compose         | .env                   |
| -------- | ---------------------- | ---------------------- |
| **Dev**  | `docker-compose up`    | `NODE_ENV=development` |
| **Prod** | `docker-compose up -d` | `NODE_ENV=production`  |

---

## 🔧 .env Konfiguration

### MariaDB (externe Verbindung)

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=turnier_db
DB_USER=turnier_user
DB_PASS=deinPasswort
```

### Server

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=deinSuperGeheimerKey123456789
CORS_ORIGIN=http://localhost:80
```

---

## 🐳 Docker Setup

### docker-compose.yml (Root)

```yaml
version: '3.8'
services:
  backend:
    build: ./turnier-backend
    ports:
      - "3001:3001"
    env_file: .env
    networks:
      - turnier-net

  frontend:
    build: ./turnier-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - turnier-net

networks:
  turnier-net:
```

**Apache2 Features**:

* mod_proxy
* mod_proxy_wstunnel
* `.htaccess` Support für React Router

---

## 🧪 Testing

### Backend

```bash
npm test --prefix turnier-backend
```

### Frontend

```bash
npm test --prefix turnier-frontend
```

**Coverage Ziel**: 80%+

---

## 📱 Screenshot Roadmap

* ✅ Woche 1: Login
* ✅ Woche 3: Turnierliste + Registrierung
* ✅ Woche 5: K.O.-Baum
* ✅ Woche 7: Live Chat
* ✅ Woche 8: Production

---

## 🤝 Contributing

1. Fork das Projekt
2. `git checkout -b feature/turnierbaum`
3. `git commit -m "feat: add knockout bracket generator"`
4. `git push origin feature/turnierbaum`
5. Pull Request erstellen

**Commit Convention**: [Conventional Commits](https://www.conventionalcommits.org)

---

## 📄 License

[MIT License](LICENSE) – Free für private & kommerzielle Nutzung

---

## 👥 Kontakt

**Autor**: DS-Coding

**Email**: [admin@ds-coding.de](mailto:admin@ds-coding.de)

**Demo**: [http://localhost](http://localhost) (nach `docker-compose up`)

**Issues**: [https://github.com/DS-Coding0/turniermanager/issues/new](https://github.com/DS-Coding0/turniermanager/issues/new)

---

⭐ **Star das Repo & fork für dein Turnier!** 🏆

```bash
KOPIEREN → README.md → git add . → git commit -m "docs: add complete README" → git push
```
