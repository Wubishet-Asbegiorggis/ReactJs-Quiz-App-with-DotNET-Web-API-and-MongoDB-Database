import React, { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../api'; // Removed BASE_URL import
import useStateContext from '../hooks/useStateContext';
import { Card, CardContent, CardHeader, List, ListItemButton, Typography, Box, LinearProgress } from '@mui/material';
import { getFormatedTime } from '../helper';
import { useNavigate } from 'react-router';

export default function Quiz() {
    const [qns, setQns] = useState([]);
    const [qnIndex, setQnIndex] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const { context, setContext } = useStateContext();
    const navigate = useNavigate();
    let timer;

    const startTimer = () => {
        timer = setInterval(() => {
            setTimeTaken(prev => prev + 1);
        }, 1000);
    };

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: []
        });

        const fetchQuestions = async () => {
            try {
                const res = await createAPIEndpoint(ENDPOINTS.question).fetch();
                setQns(res.data);
                startTimer();
            } catch (err) {
                console.error('Error fetching questions:', err);
            }
        };

        fetchQuestions();

        return () => {
            clearInterval(timer); // Clear timer on component unmount
        };
    }, []);

    const updateAnswer = (qnId, optionIdx) => {
        const temp = [...context.selectedOptions];
        temp.push({
            qnId,
            selected: optionIdx
        });

        if (qnIndex < qns.length - 1) { // Adjusted condition based on the number of questions
            setContext({ selectedOptions: [...temp] });
            setQnIndex(qnIndex + 1);
        } else {
            setContext({ selectedOptions: [...temp], timeTaken });
            navigate("/result");
        }
    };

    return (
        <div>
            {qns.length !== 0 ? (
                <Card
                    sx={{
                        maxWidth: 640,
                        mx: 'auto',
                        mt: 5,
                        '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' }
                    }}
                >
                    <CardHeader
                        title={`Question ${qnIndex + 1} of ${qns.length}`}
                        action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
                    />
                    <Box>
                        <LinearProgress variant="determinate" value={(qnIndex + 1) * 100 / qns.length} />
                    </Box>

                    <CardContent>
                        <Typography variant="h6">
                            {qns[qnIndex].qnInWords}
                        </Typography>
                        <List>
                            {qns[qnIndex].options.map((item, idx) => (
                                <ListItemButton disableRipple key={idx} onClick={() => updateAnswer(qns[qnIndex].qnId, idx)}>
                                    <div>
                                        <b>{String.fromCharCode(65 + idx) + " . "}</b>{item}
                                    </div>
                                </ListItemButton>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
