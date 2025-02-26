import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { PrayerTimes, CalculationMethod, Coordinates } from 'adhan';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, 'config.env') });

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

app.get('/', (req, res) => {
    try {
        const latitude = parseFloat(process.env.LAT);
        const longitude = parseFloat(process.env.LON);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: "Invalid latitude or longitude" });
        }

        const coordinates = new Coordinates(latitude, longitude);        
        const params = CalculationMethod.UmmAlQura();

        const today = new Date();
        const prayerTimes = new PrayerTimes(coordinates, today, params);
        
        const formatTime = (time) => {
            return time ? time.toLocaleTimeString('en-GB', { timeZone: 'Asia/Riyadh', hour12: true }) : null;
        };

        res.json({
            fajr: formatTime(prayerTimes.fajr),
            sunrise: formatTime(prayerTimes.sunrise),
            dhuhr: formatTime(prayerTimes.dhuhr),
            asr: formatTime(prayerTimes.asr),
            maghrib: formatTime(prayerTimes.maghrib),
            isha: formatTime(prayerTimes.isha),
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
