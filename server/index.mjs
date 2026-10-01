import cors from 'cors'; // CORS middleware
import express from 'express';

const app = express();
app.use(express.json());

const PORT = 3001;
const OPENF1_URL = "https://api.openf1.org/v1";


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

app.get("/api/f1/laps/:driverNumber", async (req, res) => {

    const driverNumber = req.params.driverNumber;

    try {

        const url =
            `${OPENF1_URL}/laps` +
            `?session_key=9839` +
            `&driver_number=${driverNumber}` +
            `&lap_number<=3`;

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "OpenF1 API error"
            });
        }

        const data = await response.json();

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.get("/api/f1/sessions", async (req, res) => {
    const { country, year, session } = req.query;
    try {
        const params = new URLSearchParams();
        if (country) {
            params.append("country_name", country);
        }
        if (year) {
            params.append("year", year);
        }
        if (session) {
            params.append("session_name", session);
        }
        console.log(params.toString());

        const url =
            `${OPENF1_URL}/sessions?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({
                error: "OpenF1 API error"
            });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.get("/api/f1/drivers", async (req, res) => {
    try {
        const { sessionKey } = req.query;

        if (!sessionKey) {
            return res.status(400).json({
                error: "sessionKey is required"
            })
        }
        const url =
            `${OPENF1_URL}/drivers` +
            `?session_key=${encodeURIComponent(sessionKey)}`
        console.log("URL:", url);
        
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({
                error: "OpenF1 API error"
            });
        }
        const data = await response.json();
            const drivers = [
                ...new Map(
                    data.map(({ driver_number, full_name, headshot_url }) => [
                        driver_number,
                        { driver_number, full_name, headshot_url }
                    ])
                ).values()
            ];  
        res.json(drivers);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.get("/api/f1/races", async (req, res) => {
    try {
        const { year } = req.query;
        // console.log("Year:", year);
        if (!year) {
            return res.status(400).json({
                error: "Year is required"
            });
        }
        
        const url =
            `${OPENF1_URL}/sessions` +
            `?year=${year}` +
            `&session_type=Race`;

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "OpenF1 API error"
            });
        }

        const data = await response.json();

        const races = data.map((race) => ({
            session_key: race.session_key,
            meeting_key: race.meeting_key,
            country_name: race.country_name,
            location: race.location,
            session_name: race.session_name,
            session_type: race.session_type,
            date_start: race.date_start
        }));

        res.json(races);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.get("/api/f1/races/:sessionKey/results", async (req, res) => {
    try {
        const { sessionKey } = req.params;

        const url =
            `${OPENF1_URL}/position` +
            `?session_key=${sessionKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "OpenF1 API error"
            });
        }

        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.get("/api/f1/races/:sessionKey/finalresults", async (req, res) => {
    try {
        const { sessionKey } = req.params;

        const url =
            `${OPENF1_URL}/position` +
            `?session_key=${sessionKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "OpenF1 API error"
            });
        }

        const data = await response.json();

        const latestPositions = new Map();

        for (const result of data) {
            const current = latestPositions.get(result.driver_number)
            if (!current || new Date(result.date) > new Date(current.date)) {
                latestPositions.set(result.driver_number, result);
            }
        }
        const classification = [...latestPositions.values()]
            .sort((first, second) => first.position - second.position)
        
        // console.log("Classification:", classification);
        
        res.json(classification);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});

// const API_URL = "https://api.openf1.org/v1";

// async function getSessionBelgium() {
//     const url = "https://api.openf1.org/v1/sessions?country_name=Belgium&session_name=Sprint%20Qualifying&year=2023";


//     try {
//         const response = await fetch(url);

//         if (!response.ok) {
//             throw new Error(`HTTP error: ${response.status}`);
//         }

//         const data = await response.json();

//         console.log(data);
//     } catch (error) {
//         console.error("Errore:", error.message);
//     }
// }

// getSessionBelgium();


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});