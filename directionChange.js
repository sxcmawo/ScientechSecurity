const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

let allowedRoute = { latitude: 40.7128, longitude: -74.0060, radius: 0.01 };

let taxiDriverData = {};

app.use(bodyParser.json());

app.post('/update-location/:driverId', (req, res) => {
    const driverId = req.params.driverId;
    const { latitude, longitude } = req.body;

    const distance = calculateDistance(latitude, longitude, allowedRoute.latitude, allowedRoute.longitude);
    
    if (distance > allowedRoute.radius) {

        sendNotification(driverId, latitude, longitude);
    }


    taxiDriverData[driverId] = { latitude, longitude };

    res.status(200).json({ message: 'Location updated successfully' });
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function sendNotification(driverId, latitude, longitude) {
   
    console.log(`ALERT: Taxi driver ${driverId} deviated from the allowed route. Location: ${latitude}, ${longitude}`);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
