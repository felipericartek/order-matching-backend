import 'dotenv/config';
import app from './app';
import { AppDataSource } from './ormconfig';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

AppDataSource.initialize()
    .then(() => {
        console.log('📦 Database connected successfully.');
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error connecting to the database:', error);
    });
