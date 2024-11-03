import React, { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import useEth from '../../contexts/EthContext/useEth';
import { Typography, TextField, Box, FormControl, Card } from '@mui/material';
import DoctorDetail from '../../components/doctorDetail';

const Admin = () => {
  const {
    state: { contract, accounts },
  } = useEth();

  const [docName, setDocName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [searchDoctorAddress, setSearchDoctorAddress] = useState('');
  const [doctor, setDoctor] = useState([]);
  const [doctorExist, setDoctorExist] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [transactionLatency, setTransactionLatency] = useState(null);
  const [doctorDetailsLatency, setDoctorDetailsLatency] = useState(null);

  const getDoctorDetails = async () => {
    setButtonClicked(true);
    const startTime = Date.now(); // Capture start time
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(searchDoctorAddress)) {
        alert('Please enter a valid wallet address', 'error');
        return;
      }
      const doctorExists = await contract.methods.getMappingIsDoctor(searchDoctorAddress).call({ from: accounts[0] });
      if (doctorExists) {
        setDoctorExist(true);
        const doctor = await contract.methods.getDoctor(searchDoctorAddress).call({ from: accounts[0] });
        setDoctor(doctor);
      } else {
        setDoctorExist(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      const endTime = Date.now(); // Capture end time
      const latency = (endTime - startTime) / 1000; // Calculate latency in seconds
      setDoctorDetailsLatency(latency); // Update state with latency value
    }
  };

  const handleRegisterDoctor = async () => {
    const owner = accounts[0];
    const isOwner = await contract.methods.owner().call();
    if (owner !== isOwner) {
      alert('You are not the owner of the contract');
      return;
    }

    try {
      let startTime;
      await contract.methods.registerDoctor(docName, licenseNo).send({ from: owner })
        .on('transactionHash', (hash) => {
          // Capture start time when the transaction hash is generated
          startTime = Date.now();
        })
        .on('receipt', (receipt) => {
          // Capture end time when the receipt is received
          const endTime = Date.now();
          // Calculate latency
          const latency = (endTime - startTime) / 1000;
          setTransactionLatency(latency);
          alert(`Doctor ${docName} with license number ${licenseNo} has been registered successfully`);
        });

      setDocName('');
      setLicenseNo('');
    } catch (error) {
      alert('Error registering doctor');
      console.error(error);
    }
  };

  return (
    <>
      <Card style={{ borderRadius: '10px', marginBottom: '20px' }}>
        <Box p={4}>
          <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 500 }}>
            Register Doctor with Name and License No.
          </Typography>

          <Box mb={1}>
            <TextField
              label="Doctor Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={docName}
              InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
              onChange={(e) => setDocName(e.target.value)}
            />
          </Box>

          <Box mb={1}>
            <TextField
              label="License Number"
              variant="outlined"
              fullWidth
              margin="dense"
              value={licenseNo}
              InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
              onChange={(e) => setLicenseNo(e.target.value)}
            />
          </Box>

          <CustomButton text={'Register Doctor'} handleClick={() => handleRegisterDoctor()} />

          {transactionLatency !== null && (
            <Box mt={2}>
              <Typography variant="h6" style={{ textAlign: 'center', fontWeight: 500 }}>
                Transaction Latency: {transactionLatency} seconds
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      <Card style={{ borderRadius: '10px' }}>
        <Box p={4}>
          <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 500 }}>
            Get Doctor Details
          </Typography>

          <Box display='flex' alignItems='center' my={2} width={600}>
            <FormControl fullWidth>
              <TextField
                variant='outlined'
                placeholder='Search doctor by wallet address'
                value={searchDoctorAddress}
                onChange={e => setSearchDoctorAddress(e.target.value)}
                InputProps={{ style: { fontSize: '15px' } }}
                InputLabelProps={{ style: { fontSize: '15px' } }}
                size='small'
              />
            </FormControl>
            <Box mx={2}>
              <CustomButton text={'Search'} handleClick={() => getDoctorDetails()}>
                <SearchRoundedIcon style={{ color: 'white' }} />
              </CustomButton>
            </Box>
          </Box>

          {doctorDetailsLatency !== null && (
            <Box mt={2}>
              <Typography variant="h6" style={{ textAlign: 'center', fontWeight: 500 }}>
                Doctor Details Latency: {doctorDetailsLatency.toFixed(2)} seconds
              </Typography>
            </Box>
          )}

          {!doctorExist && searchDoctorAddress && buttonClicked && (
            <Box display='flex' alignItems='center' justifyContent='center' my={5}>
              <Typography variant='h5'>No details found</Typography>
            </Box>
          )}

          {doctorExist && (
            <Box display='flex' flexDirection='column' mt={3} mb={-2}>
              <DoctorDetail doctor={doctor} />
            </Box>
          )}
        </Box>
      </Card>
    </>
  );
};

export default Admin;
