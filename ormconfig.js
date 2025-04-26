{
  "name": "order-matching-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.3.0",
    "reflect-metadata": "^0.1.13",
    "redis": "^4.6.7",
    "socket.io": "^4.7.2",
    "typeorm": "^0.3.20"
  },
  "devDependencies": {
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.2.2"
  }
}
