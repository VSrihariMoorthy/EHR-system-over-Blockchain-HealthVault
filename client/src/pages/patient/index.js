import React, { useState, useEffect } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import { Typography, TextField, Box, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded';
import PatientDetail from '../../components/patientDetail';
import HeaderAppBar from '../../components/Header';
import { create } from 'ipfs-http-client';
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import * as LitJsSdk from "@lit-protocol/lit-node-client";

function Patient() {
  const {
    state: { contract, accounts, role, loading },
  } = useEth();
  const [patient, setPatient] = useState([]);
  const [patientExist, setPatientExist] = useState(false);
  const [addr, setAddr] = useState("");
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [reasonVisit, setReasonVisit] = useState("");
  const [visitDate, setVisitDate] = useState(""); // Initialize with empty string
  const [fileHash, setFileHash] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [records, setRecords] = useState([]);
  const [recordlen, setRecordLength] = useState(0);
  const [grantLatency, setGrantLatency] = useState(null);
  const [revokeLatency, setRevokeLatency] = useState(null);

  const ipfs = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log(role);
    if (role !== 'patient') {
      navigate('/');
    }
  }, [role]);

  // Function to get patient details
  const getPatientDetails = async () => {
    try {
      const patientExists = await contract.methods.getMappingIsPatient(accounts[0]).call();
      if (patientExists) {
        setPatientExist(true);
        const patient = await contract.methods.getPatientDetails(accounts[0]).call();
        setPatient(patient);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle fetching records
  const handleGetRecords = async () => {
    try {
      const authorized = await contract.methods.getMappingIsPatient(accounts[0]).call({ from: accounts[0] });
      setAuthorized(authorized);
      const rlen = await contract.methods.getrecordlist(accounts[0]).call();
      setRecordLength(rlen);
      if (authorized) {
        let record = [];
        for (var i = 0; i < rlen; i++) {
          const result = await contract.methods
            .getPatientRecords(accounts[0], i)
            .call({ from: accounts[0] });
          record.push({
            id: result._rid,
            dname: result.dname,
            reason: result.reason,
            visDate: result.visitedDate,
            timeStamp: result.timeStamp,
            ipfs: result.ipfshash,
          });
        }
        setRecords(record);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle adding a record
  const handleAddRecord = async () => {
    try {
      const authorized = await contract.methods.getMappingIsPatient(accounts[0]).call({ from: accounts[0] });
      if (authorized) {
        const litNodeClient = new LitJsSdk.LitNodeClient({
          litNetwork: 'cayenne',
        });
        // then get the authSig
        await litNodeClient.connect();
        const authSig = await LitJsSdk.checkAndSignAuthMessage({
          chain: 'ethereum'
        });
        // Here we can setup any access control conditions we want, such as must hold a specifc NFT, or have a certain amount of ETH
      // Right now its blank so anyone can decrypt the file
        const accs = [
          {
            contractAddress: '',
            standardContractType: '',
            chain: 'ethereum',
            method: 'eth_getBalance',
            parameters: [':userAddress', 'latest'],
            returnValueTest: {
              comparator: '>=',
              value: '0',
            },
          },
        ];
        const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
          accessControlConditions: accs,
          authSig,
          chain: 'ethereum',
          file: file,
          litNodeClient: litNodeClient,
          readme: "Use IPFS CID of this file to decrypt it"
        });
        const encryptedBlob = new Blob([encryptedZip], { type: 'application/pdf' })
        const encryptedFile = new File([encryptedBlob], file.name)

        const added = await ipfs.add(encryptedFile);
        setFileHash(added.cid.toString());
        await contract.methods.addRecord(docName, reasonVisit, visitDate, accounts[0], added.cid.toString()).send({ from: accounts[0] });
        alert('File added successfully');
        console.log(added.cid.toString());
        window.location.reload();
      }
      if (!authorized) {
        alert('You cannot upload for someone else\'s records');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  // Grant access to a doctor
  const handleGrantAccess = async () => {
    try {
      const authorized = await contract.methods.isAuthorized(accounts[0], addr).call({ from: accounts[0] });
      if (authorized) {
        alert('User already authorized');
      } else {
        const tx = contract.methods.grantAccess(addr).send({ from: accounts[0] });

        // Start timer on transactionHash event
        tx.on('transactionHash', (hash) => {
          const startTime = performance.now();

          tx.on('receipt', (receipt) => {
            const endTime = performance.now();
            const latency = endTime - startTime;
            setGrantLatency(latency);
            alert(`Access granted successfully. Latency: ${latency.toFixed(2)} ms`);
            setAddr("");
          });
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Revoke access from a doctor
  const handleRevokeAccess = async () => {
    try {
      const tx = contract.methods.revoke_access(addr).send({ from: accounts[0] });

      // Start timer on transactionHash event
      tx.on('transactionHash', (hash) => {
        const startTime = performance.now();

        tx.on('receipt', (receipt) => {
          const endTime = performance.now();
          const latency = endTime - startTime;
          setRevokeLatency(latency);
          alert(`Access revoked successfully. Latency: ${latency.toFixed(2)} ms`);
          setAddr("");
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const decryptFile = async (file) => {
    try {
      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: 'cayenne',
      });
      await litNodeClient.connect();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: 'ethereum'
      });
      const { decryptedFile, metadata } = await LitJsSdk.decryptZipFileWithMetadata({
        file: file,
        litNodeClient: litNodeClient,
        authSig: authSig,
      })
      // After we have our dcypted file we can download it
      const blob = new Blob([decryptedFile], { type: 'application/octet-stream' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = metadata.name;  // Set desired filename and extension
      downloadLink.click();

    } catch (error) {
      alert("Trouble decrypting file")
      console.log(error)
    }

  }

  // Fetch patient details and records on component mount
  useEffect(() => {
    getPatientDetails();
    handleGetRecords();
  }, []);

  return (
    <>
      <HeaderAppBar />
      <Box ml={20} mr={20} mt={4} mb={4}>
        <Typography variant='h4' fontWeight={600} style={{ textAlign: 'left' }}>
          Your Details
        </Typography>
        {patientExist && (
          <Box display='flex' flexDirection='column' mt={3} mb={-2}>
            <PatientDetail patients={patient} />
          </Box>
        )}

        <Box mt={6} mb={6}>
          <Typography variant="h4" fontWeight={600} gutterBottom sx={{ textAlign: 'left' }}>
            Your Medical Records
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#00BFA5' }}>
                  <TableCell style={{ color: '#FFFFFF', fontSize: '15px' }}>Record ID</TableCell>
                  <TableCell style={{ color: '#FFFFFF', fontSize: '15px' }} align="center">Doctor Name</TableCell>
                  <TableCell style={{ color: '#FFFFFF', fontSize: '15px' }} align="center">Reason</TableCell>
                  <TableCell style={{ color: '#FFFFFF', fontSize: '15px' }} align="center">Visited Date</TableCell>
                  <TableCell style={{ color: '#FFFFFF', fontSize: '15px' }} align="center">Time Stamp</TableCell>
                  <TableCell style={{ color: '#FFFFFF', fontSize: '15px' }} align="center">Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell component="th" scope="row" style={{ color: '#000000', fontSize: '15px' }}>
                      {record.id}
                    </TableCell>
                    <TableCell align="center" style={{ color: '#000000', fontSize: '15px' }}>{record.dname}</TableCell>
                    <TableCell align="center" style={{ color: '#000000', fontSize: '15px' }}>{record.reason}</TableCell>
                    <TableCell align="center" style={{ color: '#000000', fontSize: '15px' }}>{record.visDate}</TableCell>
                    <TableCell align="center" style={{ color: '#000000', fontSize: '15px' }}>{record.timeStamp}</TableCell>
                    <TableCell align="center" style={{ color: '#000000', fontSize: '15px' }}>
                    <IconButton onClick={(e) => { e.preventDefault(); fetch("https://ipfs.io/ipfs/" + record.ipfs)
                      .then(response => response.blob())
                      .then(blob => {
                          // Call the decryptFile function with the fetched file as a parameter
                          decryptFile(blob);
                      })
                      .catch(error => {
                          console.error('Error fetching or decrypting file:', error);
                    }); 
                    }}>
                        <CloudDownloadRoundedIcon fontSize='large' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box ml={20} mr={20} mt={6} mb={6}>
        <Typography variant="h4" gutterBottom fontWeight={600} mb={2}>
          Upload Your Records
        </Typography>
        <Card variant="outlined" style={{ borderRadius: "10px" }} >
          <Box display="flex" flexDirection="column" justifyContent="center" p={5}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Doctor Name"
                value={docName}
                InputProps={{ style: { fontSize: '15px' } }}
                InputLabelProps={{ style: { fontSize: '15px' } }}
                size='small'
                onChange={(e) => setDocName(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Reason of Visit"
                value={reasonVisit}
                InputProps={{ style: { fontSize: '15px' } }}
                InputLabelProps={{ style: { fontSize: '15px' } }}
                size='small'
                onChange={(e) => setReasonVisit(e.target.value)}
              />
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Visit Date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                InputProps={{ style: { fontSize: '15px' } }}
                InputLabelProps={{ style: { fontSize: '15px' }, shrink: true }}
                size='small'
                // Set max attribute to today's date
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <input type="file" onChange={handleFileUpload} />
            </Box>
            <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
              <CustomButton text={'Add Record'} handleClick={() => handleAddRecord()} />
            </Box>
          </Box>
        </Card>
      </Box>

      <Box ml={20} mr={20} mt={6} mb={6}>
        <Typography variant="h4" gutterBottom fontWeight={600} mb={2}>
          Grant/Revoke Access to Doctors
        </Typography>
        <Card variant="outlined" style={{ borderRadius: "10px" }}>
          <Box p={3}>
            <Box display="flex" alignItems="center" mt={2}>
              <TextField
                label="Address"
                value={addr}
                InputProps={{ style: { fontSize: '15px' } }}
                InputLabelProps={{ style: { fontSize: '15px' } }}
                size='small'
                onChange={(e) => setAddr(e.target.value)}
                fullWidth
              />
            </Box>
            <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
              <CustomButton text={'Grant Access'} handleClick={() => handleGrantAccess()} />
              <Box ml={2} mr={2} />
              <CustomButton text={'Revoke Access'} handleClick={() => handleRevokeAccess()} />
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  )
}

export default Patient;

