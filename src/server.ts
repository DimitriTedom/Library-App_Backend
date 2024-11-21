import app from "./app";
import {prisma} from './prisma/client';
import cron from "node-cron";
import {sendReminders} from './jobs/reminderJob'
import variable from "./variable";

const PORT = variable.PORT;

(async ()=>{
    try {
        await prisma.$connect();
        console.log('Connecté a la base de données');

        app.listen(PORT,()=>{
            console.log(`Serveur en cours d\'exécution sur le port ${PORT}`);
        })
    } catch (error) {
        console.error('Erreur lors de la connection a la base de donnees',error);
        process.exit(1);
    }
})();

cron.schedule("0 8 * * *", () => {
    console.log("Envoi des rappels de retour de livres...");
    sendReminders();
});