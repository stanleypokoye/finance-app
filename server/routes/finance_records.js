const express = require("express");
const router = express.Router();
const fs = require('fs').promises; 
const path = require('path');




router.get('/records', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error("Error reading JSON file:", err);
        res.status(500).json({ message: 'Error reading data' });
    }
});

router.post('/records', async (req, res) => {

    const filePath = path.join(__dirname, '../data/data.json');
    try {
        const rawData = await fs.readFile(filePath, 'utf8')
        const data = JSON.parse(rawData)

        //Add ids to existing records if they dont have
        if (data.budgets) {
            data.budgets = data.budgets.map(record => 
                record.id ? record : {...record, id: Date.now() + Math.random()}
            )
        }

        if (data.pots) {
            data.pots = data.pots.map(record => 
                record.id ? record : {...record, id: Date.now() + Math.random()}
            )
        }

        const recordType = req.body.type;

        const newRecord = {
            id: Date.now() + Math.random(),
            ...req.body,
            date: new Date().toISOString()
        }

        //remove type from the record before saving
        delete newRecord.type;

        // Add new record to the appropriate collection
        if (recordType === 'budget'){
            if (!data.budgets) data.budgets = []
            data.budgets.push(newRecord)
        } else if (recordType === 'pots') {
            if (!data.pots) data.pots = []
            data.pots.push(newRecord)      
        } else {
            return res.status(400).json({message: "Invalid record type, use \"Budget\" or \"pots\""})
        }

        //write updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))

        res.status(201).json(newRecord);

    } catch (err) {
        console.error("error creating new record", err)
        res.status(500).json({ message: "Error creating new record", Error: err.message})
    }

})

router.put('/records/:type/:id', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json');
    const recordId = parseFloat(req.params.id);
    const recordType = req.params.type;
    const { action, amount, ...recordData } = req.body;

    
    try {
        // Read the existing data
        const rawData = await fs.readFile(filePath, 'utf8');
        let data = JSON.parse(rawData);

        // Validate record type - fix case consistency
        if (recordType !== "budgets" && recordType !== "pots") {
            return res.status(400).json({ message: "Invalid record type. Use 'budgets' or 'pots'." });
        }

        // Find the index of the record to update
        const recordIndex = data[recordType].findIndex(record => record.id === recordId);
        
        if (recordIndex === -1) {
            return res.status(404).json({ message: 'Record not found' });
        }

        const record = data[recordType][recordIndex];

        // Process pot actions (add/withdraw) if applicable
        if (recordType === 'pots' && action) {
            // Convert numbers explicitly with parseFloat to ensure consistent behavior
            let updatedTotal = parseFloat(record.total) || 0;
            let updatedBalance = parseFloat(data.balance.current) || 0;

            

            const amountNum = parseFloat(amount);
            
            if (isNaN(amountNum) || amountNum <= 0) {
                return res.status(400).json({ message: 'Invalid amount. Must be a positive number.' });
            }

            if (action === 'add') {
                // Check if there's enough balance
                if (updatedBalance < amountNum) {
                    return res.status(400).json({ message: "Insufficient balance" });
                }
                
                // Update both values
                updatedBalance = updatedBalance - amountNum;
                updatedTotal = updatedTotal + amountNum;
                
                
                
                // Update the record with the new total
                record.total = updatedTotal
                
                // Update the balance in data object
                data.balance.current = updatedBalance;
                
            } else if (action === 'withdraw') {
                // Check if there's enough in the pot
                if (updatedTotal < amountNum) {
                    return res.status(400).json({ message: 'Insufficient funds in pot' });
                }
                
                // Update both values
                updatedBalance = updatedBalance + amountNum;
                updatedTotal = updatedTotal - amountNum;
                
                console.log(`After calculations: new pot total=${updatedTotal}, new balance=${updatedBalance}`);
                
                // Update the record with the new total
                record.total = updatedTotal;
                
                // Update the balance in data object
                data.balance.current = updatedBalance;
                
            } else {
                return res.status(400).json({ message: 'Invalid action. Use "add" or "withdraw".' });
            }
            
            
        }

        // Update the record with all other changed data
        data[recordType][recordIndex] = {
            ...record,
            ...recordData,
            date: new Date().toISOString()
        };

        // Write updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        

        
        res.json({
            record: data[recordType][recordIndex],
            balance: data.balance.current
        });
        
    } catch (err) {
        console.error("Error updating record:", err);
        res.status(500).json({ message: "Error updating record", error: err.message });
    }
});


router.delete('/records/:type/:id', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json');
    const recordId = parseFloat(req.params.id);
    const recordType = req.params.type;
    
    try {
          // Read existing data
          const rawData = await fs.readFile(filePath, 'utf8');
          let data = JSON.parse(rawData);
          
          // Validate record type
          if (recordType !== 'budgets' && recordType !== 'pots') {
              return res.status(400).json({ message: 'Invalid record type. Use "budget" or "pots".' });
          }
          
          // Find the index of the record to delete
          const recordIndex = data[recordType].findIndex(record => record.id === recordId);
          console.log("index",recordIndex)
          
          // If record not found, return 404
          if (recordIndex === -1) {
              return res.status(404).json({ message: 'Record not found' });
          }
        
          const deleteRecord = data[recordType].splice(recordIndex, 1)[0]

          await fs.writeFile(filePath, JSON.stringify(data, null, 2))

          res.json(deleteRecord)
    } catch (err) {
        console.error("Error deleting record:", err);
        res.status(500).json({ message: 'Error deleting record', error: err.message });
    }
})
module.exports = router;

