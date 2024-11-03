import React, { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import CustomButton from '../../components/CustomButton';
import { TextField, Box, Typography, Card } from "@mui/material";

function DoctorRegister() {
  const {
    state: { contract, accounts },
  } = useEth();
  const [doctorName, setDoctorName] = useState("");
  const [docContact, setDocContact] = useState("");
  const [hName, setHName] = useState("");
  const [dept, setDept] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [transactionLatency, setTransactionLatency] = useState(null);

  const handleDoctorRegister = async () => {
    try {
      // Check if all required fields have been filled
      if (!doctorName || !docContact || !hName || !dept || !licenseNo) {
        throw new Error("Please fill in all required fields");
      }

      // Check the length of the input values
      if (doctorName.length === 0 || docContact.length === 0 || hName.length === 0 || dept.length === 0) {
        throw new Error("All input fields are required");
      }

      // Check the license number input value
      if (isNaN(Number(licenseNo)) || licenseNo < 1) {
        throw new Error("Please enter a valid license number");
      }

      // Check if the doctor has already been registered
      const isRegistered = await contract.methods.getMappingIsDoctor(accounts[0]).call();
      if (isRegistered) {
        throw new Error("Doctor already registered");
      }
      const isDoctorAddedbyAdmin = await contract.methods.isRegisteredbyAdmin(doctorName, licenseNo).call();
      if (!isDoctorAddedbyAdmin) throw new Error("Get yourself registered by Admin");

      // Start the timer just before sending the transaction
      let startTime = null;

      // Call the Solidity function with the user's input values
      contract.methods.addDoctor(doctorName, docContact, hName, dept, licenseNo).send({ from: accounts[0] })
        .on('transactionHash', (hash) => {
          // Start the timer when the transaction is broadcasted
          startTime = Date.now();
        })
        .on('receipt', (receipt) => {
          // Capture end time when the transaction is confirmed
          const endTime = Date.now();
          // Calculate latency in seconds
          const latency = (endTime - startTime) / 1000;
          setTransactionLatency(latency);

          // Display success message
          alert("Doctor registered successfully!");

          // Reset the form fields
          setDoctorName("");
          setDocContact("");
          setHName("");
          setDept("");
          setLicenseNo("");
        })
        .on('error', (error) => {
          alert('Error registering doctor');
          console.error(error);
        });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Card sx={{ borderRadius: '10px', width: '45%' }}>
        <Box p={4}>
          <Typography variant="h5" mb={1} gutterBottom sx={{ textAlign: 'center', fontWeight: 500 }}>
            Add Doctor Details
          </Typography>
          <TextField
            label="Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{ style: { fontSize: '15px' } }}
            InputLabelProps={{ style: { fontSize: '15px' } }}
            size='small'
          />
          <TextField
            label="Contact"
            value={docContact}
            onChange={(e) => setDocContact(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{ style: { fontSize: '15px' } }}
            InputLabelProps={{ style: { fontSize: '15px' } }}
            size='small'
          />
          <TextField
            label="Hospital Name"
            value={hName}
            onChange={(e) => setHName(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{ style: { fontSize: '15px' } }}
            InputLabelProps={{ style: { fontSize: '15px' } }}
            size='small'
          />
          <TextField
            label="Department"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{ style: { fontSize: '15px' } }}
            InputLabelProps={{ style: { fontSize: '15px' } }}
            size='small'
          />
          <TextField
            label="License No."
            value={licenseNo}
            onChange={(e) => setLicenseNo(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{ style: { fontSize: '15px' } }}
            InputLabelProps={{ style: { fontSize: '15px' } }}
            size='small'
          />
          <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
            <CustomButton text={'Add Doctor Details'} handleClick={handleDoctorRegister} />
          </Box>
          {transactionLatency !== null && (
            <Box mt={2}>
              <Typography variant="h6" style={{ textAlign: 'center', fontWeight: 500 }}>
                Transaction Latency: {transactionLatency} seconds
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </>
  );
}

export default DoctorRegister;