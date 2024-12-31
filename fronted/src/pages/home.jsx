import { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../context/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    // Handle video call joining logic
    const handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            alert("Please enter a valid meeting code.");
            return;
        }

        try {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        } catch (error) {
            console.error("Error adding to history", error);
            alert("Something went wrong while joining the meeting.");
        }
    };

    return (
        <>
            {/* Navbar */}
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h2>Apna Video Call</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => navigate("/history")}>
                        <RestoreIcon />
                    </IconButton>
                    <p>History</p>

                    <Button onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/auth");
                    }}>
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>

                        <div style={{ display: 'flex', gap: "10px" }}>
                            <TextField 
                                onChange={e => setMeetingCode(e.target.value)} 
                                value={meetingCode}
                                id="outlined-basic" 
                                label="Meeting Code" 
                                variant="outlined" 
                            />
                            <Button onClick={handleJoinVideoCall} variant='contained'>
                                Join
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img src='/logo3.png' alt="Apna Video Call Logo" />
                </div>
            </div>
        </>
    );
}

export default withAuth(HomeComponent);
