import Agenda from "agenda";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

console.log('db_url', process.env.MONGODB_URL);
const agenda = new Agenda({ db: { address: process.env.MONGODB_URL, collection: 'agendaJobs' } });

agenda.define('activate pending user', async (job) => {
    const { userId } = job.attrs.data;
    const user = await User.findById(userId);
    if (user && user.status === 'pending') {
        user.status = 'active';
        await user.save();
    }
});

(async function() {
    await agenda.start();
})();

export default agenda;