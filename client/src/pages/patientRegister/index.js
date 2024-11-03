import React, { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { TextField, Card, Box, Typography, MenuItem } from '@mui/material';
import CustomButton from '../../components/CustomButton';

function PatientRegister() {
    const { state: { contract, accounts } } = useEth();
    const [patientName, setPatientName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [bloodgroup, setBloodgroup] = useState('');
    const [elapsedTime, setElapsedTime] = useState(null);

    const handleRegisterPatient = async () => {
        try {
            if (phone.length !== 10 || isNaN(phone)) {
                throw new Error("Phone number should be a 10-digit number.");
            }
            const isRegistered = await contract.methods.getMappingIsPatient(accounts[0]).call();
            if (isRegistered) {
                throw new Error("Patient already registered");
            }
            
            // Create a transaction object
            const transaction = contract.methods.addPatient(
                patientName,
                phone,
                gender,
                dob,
                bloodgroup
            );
            
            // Send the transaction and listen for the transactionHash event
            let startTime;
            transaction.send({ from: accounts[0] })
                .on('transactionHash', (hash) => {
                    // Record the start time when the user confirms the transaction in MetaMask
                    startTime = new Date().getTime();
                })
                .on('receipt', (receipt) => {
                    // Record the end time when the transaction is mined
                    const endTime = new Date().getTime();
                    // Calculate the elapsed time
                    const elapsedTime = endTime - startTime;
                    setElapsedTime(elapsedTime);

                    console.log(`Transaction Hash: ${receipt.transactionHash}`);
                    console.log(`Elapsed Time: ${elapsedTime} ms`);
                })
                .on('error', (error) => {
                    console.error(error.message);
                });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Card sx={{ borderRadius: '10px', width: '45%' }}>
            <Box p={4}>
                <Typography variant="h5" mb={2} gutterBottom sx={{ textAlign: 'center', fontWeight: 500 }}>
                    Register yourself as a Patient.
                </Typography>
                <Box sx={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Patient Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                    />
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                    />
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Date of Birth"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' }, shrink: true }}
                        size='small'
                        // Set max attribute to today's date
                        inputProps={{ max: new Date().toISOString().split('T')[0] }}
                    />
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <TextField
                        fullWidth
                        select
                        label="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <TextField
                        fullWidth
                        select
                        label="Blood Group"
                        value={bloodgroup}
                        onChange={(e) => setBloodgroup(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                    >
                        <MenuItem value="O-">O-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="B +">B+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                    </TextField>
                </Box>
                <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <CustomButton text={'Register Patient'} handleClick={() => handleRegisterPatient()} />
                </Box>
                {elapsedTime !== null && (
                    <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="body1">Transaction Time: {elapsedTime} ms</Typography>
                    </Box>
                )}
            </Box>
        </Card>
    );
}

export default PatientRegister;
