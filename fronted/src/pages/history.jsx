import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Box, IconButton, Typography, Snackbar,CardContent } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);  // Always start with an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const history = await getHistoryOfUser();
                console.log('Fetched history:', history);  // Check what you are receiving
                setMeetings(Array.isArray(history) ? history : []);  // Ensure it's an array
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <IconButton onClick={() => routeTo("/home")}>
                <HomeIcon />
            </IconButton>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : meetings.length === 0 ? (
                <Typography>No meetings found.</Typography>
            ) : (
                <Box>
                    {meetings.map((e, i) => (
                        <Card key={i} variant="outlined" sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Code: {e.meetingCode}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Date: {formatDate(e.date)}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
            <Snackbar
                open={error}
                autoHideDuration={6000}
                onClose={() => setError(false)}
                message="Failed to fetch meeting history"
            />
        </div>
    );
}
