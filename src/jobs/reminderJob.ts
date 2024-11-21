import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Fonction pour envoyer un email
const sendEmailReminder = async (userEmail: string, message: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Email de l'expéditeur
            pass: process.env.EMAIL_PASS, // Mot de passe de l'expéditeur
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Rappel de retour de livre",
        text: message,
    });
};

// Fonction principale pour gérer les rappels
export const sendReminders = async () => {
    try {
        // Trouvons les emprunts dont la date de retour est dans les 3 prochains jours
        const upcomingReturns = await prisma.borrow.findMany({
            where: {
                dateRetour: {
                    gte: new Date(),
                    lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Prochaines 72 heures
                },
            },
            include: {
                user: true, // Inclure les détails de l'utilisateur
                livre: true,       // Inclure les détails du livre
            },
        });

        // Envoyons un email pour chaque emprunt
        for (const loan of upcomingReturns) {
            const message = `Bonjour ${loan.user.nom},\n\nLe livre "${loan.livre.title}" doit être retourné avant le ${loan.dateRetour?.toLocaleDateString()}. Merci de respecter cette échéance.`;
            await sendEmailReminder(loan.user.email, message);
            console.log(`Rappel envoyé à ${loan.user.email}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi des rappels :", error);
    } finally {
        await prisma.$disconnect();
    }
};

// Exécutons la fonction si elle est appelée directement
if (require.main === module) {
    sendReminders().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
