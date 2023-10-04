// patient.service.js
const express = require('express');

module.exports = (db) => {
const router = express.Router();

// Define a route for generating a unique medical record number
router.get('/generate-medical-record-number', async (req, res) => {
  try {
    const medicalRecordNumber = generateRandomSixDigitNumber();
    res.json({ medicalRecordNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Define a route for searching patients by medical record number or name
router.get('/search', async (req, res) => {
  try {
    const { medicalRecordNumber, name } = req.query;

    if (!medicalRecordNumber && !name) {
      return res.status(400).json({ error: 'Medical record number or name is required' });
    }

    // Call the function to query patient data based on criteria (medicalRecordNumber or name)
    const patient = await queryPatientData({ medicalRecordNumber, name, db });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Construct a simplified FHIR-compliant patient resource
    const fhirPatient = {
      resourceType: 'Patient',
      name: [
        {
          given: [patient.name], // Replace with actual patient name fields
        },
      ],
      gender: patient.gender || 'unknown',
      birthDate: patient.birthDate, // Replace with actual birth date field
      address: patient.address,       // Include other FHIR-compliant fields as needed
      medicalRecordNumber: patient.medicalRecordNumber
    };

    res.json(fhirPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/create', async (req, res) => {
    try {
      // Parse the patient data from the request body
      const { name, gender, birthDate, address } = req.body;
  
      // Generate a unique medical record number (you can define a function for this)
      const medicalRecordNumber = generateRandomSixDigitNumber();
  
      // Insert the new patient into the database
      await createPatient({ medicalRecordNumber, name, gender, birthDate, address });
  
      res.json({ message: 'Patient created successfully', medicalRecordNumber });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  async function createPatient({ medicalRecordNumber, name, gender, birthDate, address }) {
    try {

        let medicalRecordNumber;
        let isUnique = false;
    
        // Keep generating a new medical record number until it's unique
        while (!isUnique) {
          medicalRecordNumber = generateRandomSixDigitNumber();
          const existingPatient = await queryPatientData({ medicalRecordNumber });

          if (!existingPatient) {
            // The generated number is unique
            isUnique = true;
          }
        }
    
      const query = `
        INSERT INTO patients (medicalRecordNumber, name, gender, birthDate, address)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.run(query, [medicalRecordNumber, name, gender, birthDate, address]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  function generateRandomSixDigitNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  
// Function to query patient data based on FHIR resource parameters
async function queryPatientData({ medicalRecordNumber, name }) {
    try {
        let query = 'SELECT * FROM patients WHERE 1';

        if (medicalRecordNumber) {
          query += ` AND medicalRecordNumber = '${medicalRecordNumber}'`;
        }
    
        if (name) {
          query += ` AND name = '${name}'`;
        }
    
        const patient = await db.get(query); // Use db.get to retrieve a single row
        return patient;
      } catch (error) {
        console.error(error);
        throw error;
      }
  }

return router;
};