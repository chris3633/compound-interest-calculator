import React, { useState } from 'react';
import { CssBaseline, Box, Typography, Input, Button, Checkbox, Alert, IconButton } from '@mui/joy';
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Import DarkMode Icon
import LightModeIcon from '@mui/icons-material/LightMode'; // Import LightMode Icon
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from 'recharts';


function App() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositFrequency, setDepositFrequency] = useState('yearly'); // default to yearly
  const [compoundFrequency, setCompoundFrequency] = useState('yearly'); // default to yearly
  const [result, setResult] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [darkTheme, setDarkTheme] = useState(true); // Theme state
  const [chartData, setChartData] = useState([]); // State to hold chart data



  const calculateCompoundInterest = () => {
    setErrorMessage(''); // Clear previous errors


      // Check for empty fields
  if (!rate || !time || !depositAmount) {
    setErrorMessage('Please fill in all fields.');
    return;
  }

  // Check for conflicting selections
  if (depositFrequency === 'monthly' && compoundFrequency === 'yearly') {
    setErrorMessage('You cannot calculate yearly interest with a monthly deposit.');
    return;
  }

  if (depositFrequency === 'yearly' && compoundFrequency === 'monthly') {
    setErrorMessage('You cannot enter a monthly deposit amount while selecting yearly compounding.');
    return;
  }

    const P = parseFloat(principal); // Initial principal
    const r = parseFloat(rate) / 100; // Annual interest rate
    const t = parseFloat(time); // Time in years
    const PMT = parseFloat(depositAmount); // Regular deposit amount
    const n = compoundFrequency === 'monthly' ? 12 : 1; // Compounding frequency (monthly or yearly)

    const chartData = [];
let currentValue = P; // Value without interest

// Calculate compound rate
const compoundRate = r / n;

for (let year = 0; year <= t; year++) {
  // Calculate future value with interest for the principal
  const futureValueOfPrincipal = P * Math.pow(1 + compoundRate, n * year);

  // Calculate future value of regular deposits up to this year
  const futureValueOfDeposits = PMT * ((Math.pow(1 + compoundRate, n * year) - 1) / compoundRate);

  // Total future value for this year
  const totalFutureValue = futureValueOfPrincipal + futureValueOfDeposits;

  // Store data for chart
  chartData.push({
    year: year,
    valueWithoutInterest: currentValue,
    valueWithInterest: totalFutureValue.toFixed(2),
  });

  // Update current value for the next year (this is to keep track of total deposits)
  currentValue += PMT * (n === 12 ? 12 : 1); // This updates currentValue for deposits only
}

// Set the total amount and interest earned
setTotalAmount(currentValue.toFixed(2) + P); // Add the initial principal to total deposits
setResult((chartData[t].valueWithInterest - (P + currentValue)).toFixed(2)); // Interest earned
setChartData(chartData); // Set the data for the chart


    if (!isNaN(P) && !isNaN(r) && !isNaN(t)) {
      const compoundRate = r / n; // Interest rate per compounding period

      // Calculate future value of initial principal
      const futureValueOfPrincipal = P * Math.pow(1 + compoundRate, n * t);

      // Calculate future value of regular deposits
      const futureValueOfDeposits = PMT * ((Math.pow(1 + compoundRate, n * t) - 1) / compoundRate);

      // Total future value
      const total = futureValueOfPrincipal + futureValueOfDeposits;

      // Total deposits (initial deposit + total of all deposits)
      const totalDeposits = P + (PMT * t);

      // Calculate interest earned
      const compoundInterest = total - totalDeposits;

      // Set states for total amount and interest earned
      setTotalAmount(total.toFixed(2));
      setResult(compoundInterest.toFixed(2));
    } else {
      setTotalAmount(null);
      setResult('Please enter valid numbers');
    }
  };

  // Reset results when deposit frequency or compound frequency changes
  const handleDepositFrequencyChange = (frequency) => {
    setDepositFrequency(frequency);
    //setTotalAmount(null);
    //setResult(null);

  };

  const handleCompoundFrequencyChange = (frequency) => {
    setCompoundFrequency(frequency);
    //setTotalAmount(null);
    //setResult(null);
  };

  // Toggle theme function
  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };

  // Dynamic Y-Axis scaling logic
  const maxValue = Math.max(...chartData.map(d => parseFloat(d.valueWithInterest)));
  let tickInterval;

  if (maxValue <= 20000) {
      tickInterval = 5000; // Show every 5k if max is <= 20k
  } else if (maxValue <= 80000) {
      tickInterval = 10000; // Show every 10k if max is <= 80k
  } else {
      tickInterval = 20000; // Show every 20k if max is > 80k
  }

  // Create dynamic ticks array
  const ticks = Array.from(
      { length: Math.ceil(maxValue / tickInterval) + 1 },
      (_, i) => i * tickInterval
  );

  return (
    <Box
    sx={{
      minHeight: '100vh', // Ensure it covers at least the full viewport height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start', // Aligns content to the top
      alignItems: 'center',
      padding: 2,
      bgcolor: darkTheme ? '#1a1a1a' : 'grey.100', // Darker background for dark mode
      color: darkTheme ? 'white' : 'black', // Text color based on theme
    }}
    >
      <CssBaseline />

      {/* Theme Toggle Button */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          bgcolor: darkTheme ? 'grey.800' : 'white',
          color: darkTheme ? 'white' : 'black',
          '&:hover': {
            bgcolor: darkTheme ? 'grey.700' : 'grey.300',
          },
        }}
      >
        {darkTheme ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>


  {/* Title */}
  <Typography level="h1" sx={{ marginTop: 0, marginBottom: 0, color: darkTheme ? 'white' : 'black' }}>
    NORA
  </Typography>

  {/* Subtitle */}
  <Typography level="h4" sx={{ marginTop: 0, marginBottom: 2, color: darkTheme ? 'white' : 'black' }}>
    The Compound Interest Calculator
  </Typography>

      <Box sx={{ width: '300px', marginBottom: 0 }}>
        <Typography level="body1">Principal Amount:</Typography>
        <Input
  type="number"
  value={principal === 0 ? '' : principal} // Don't display 0 by default
  onChange={(e) => {
    let newValue = e.target.value;

    // If the input is empty, set the principal to 0
    if (newValue === '') {
      setPrincipal(0);
    } else {
      // Remove leading zeros if any
      newValue = newValue.replace(/^0+(?=\d)/, '');

      // Prevent negative values
      if (Number(newValue) >= 0) {
        setPrincipal(Number(newValue)); // Convert to number and set state
      }
    }
  }}
  sx={{ marginBottom: 2 }}
/>


      </Box>
      <Box sx={{ width: '300px', marginBottom: 0 }}>
        <Typography level="body1">Interest Rate (%):</Typography>
        <Input
  type="number"
  value={rate === 0 ? '' : rate} // Don't display 0 by default
  onChange={(e) => {
    const newValue = Number(e.target.value);
    // Update the state only if the new value is 0 or greater
    if (newValue >= 0) {
      setRate(newValue);
    }
  }}
  sx={{ marginBottom: 2 }}
/>
      </Box>
      <Box sx={{ width: '300px', marginBottom: 0 }}>
        <Typography level="body1">Time (years):</Typography>
        <Input
  type="number"
  value={time === 0 ? '' : time} // Don't display 0 by default

  onChange={(e) => {
    const newValue = Number(e.target.value);
    // Update the state only if the new value is 0 or greater
    if (newValue >= 0) {
      setTime(newValue);
    }
  }}
  sx={{ marginBottom: 2 }}
/>
      </Box>
      <Box sx={{ width: '300px', marginBottom: 0 }}>
        <Typography level="body1">{depositFrequency === 'monthly' ? 'Monthly Deposit:' : 'Yearly Deposit:'}</Typography>
        <Input
  type="number"
  value={depositAmount === 0 ? '' : depositAmount} // Don't display 0 by default

  onChange={(e) => {
    const newValue = Number(e.target.value);
    // Update the state only if the new value is 0 or greater
    if (newValue >= 0) {
      setDepositAmount(newValue);
    }
  }}
  sx={{ marginBottom: 1 }} // Ensure some spacing below the input
/>

      </Box>
      <Box sx={{ width: '300px', marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={depositFrequency === 'monthly'}
            onChange={() => handleDepositFrequencyChange('monthly')}
          />
          <Typography level="body2" display="inline" sx={{ marginLeft: 1 }}>Monthly Deposit</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={depositFrequency === 'yearly'}
            onChange={() => handleDepositFrequencyChange('yearly')}
          />
          <Typography level="body2" display="inline" sx={{ marginLeft: 1 }}>Yearly Deposit</Typography>
        </Box>
      </Box>
      <Box sx={{ width: '300px', marginBottom: 2 }}>
        <Typography level="body1" sx={{ textAlign: 'center' , marginBottom: 2, marginTop: 1, fontWeight: 'bold' }}>Compound Frequency:</Typography>
        <div>
          <Checkbox
            checked={compoundFrequency === 'monthly'}
            onChange={() => handleCompoundFrequencyChange('monthly')}
          />
          <Typography level="body2" display="inline" sx={{ marginLeft: 1 }}>Calculate Monthly Interest</Typography>
        </div>
        <div style={{ marginTop: '8px' }}> {/* Added margin for spacing */}
          <Checkbox
            checked={compoundFrequency === 'yearly'}
            onChange={() => handleCompoundFrequencyChange('yearly')}
          />
          <Typography level="body2" display="inline" sx={{ marginLeft: 1 }}>Calculate Yearly Interest</Typography>
        </div>
      </Box>
      <Box sx={{ width: '300px', marginTop: 2, marginBottom: 2}}>
        <Button
          variant="contained"
          fullWidth
          onClick={calculateCompoundInterest}
          sx={{
            backgroundColor: '#4CAF50', // Green
            color: 'white',
            '&:hover': {
              backgroundColor: '#45a049',
            },
          }}
        >
          Calculate
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ marginTop: 2 }}>{errorMessage}</Alert>
      )}
     {totalAmount && (
  <Box sx={{ marginTop: 2, textAlign: 'center' }}>
    <Typography level="h4" sx={{ color: darkTheme ? 'white' : 'black' }}>
      Total Amount: ${parseFloat(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </Typography>

    <Typography level="h4" sx={{ marginBottom: 5, color: darkTheme ? 'white' : 'black' }}>
      Total Interest: ${parseFloat(result).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </Typography>
  </Box>
)}
{chartData.length > 0 && (
  <ResponsiveContainer width="80%" height={400}>
<LineChart width={600} height={400} data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="year">
        <Label value="Years" position="bottom" offset={0} /> {/* Add the label for years */}
    </XAxis>
    <YAxis
        domain={[0, (dataMax) => Math.ceil(dataMax / tickInterval) * tickInterval]}
        ticks={ticks}
        padding={{ top: 10, bottom: 10 }} // Adjust padding to create space
        tickFormatter={(value) => `${value / 1000}k`} // Format numbers as '10k', '20k', etc.
    >
        <Label
            value="Amount ($)"
            angle={-90}
            position="insideLeft" // Change to outsideLeft if you prefer
            style={{ textAnchor: 'middle', fontSize: '12px' }}
        />
    </YAxis>
    <Tooltip />
    <Legend
  layout="vertical"
  align="center"
  verticalAlign="bottom"
  wrapperStyle={{ paddingTop: 20, paddingLeft:20 }} // Adjusted for top spacing
/>


<Line type="monotone" dataKey="valueWithoutInterest" stroke="#8884d8" />
    <Line type="monotone" dataKey="valueWithInterest" stroke="#82ca9d" />
</LineChart>
  </ResponsiveContainer>
)}
    </Box>
  );
}

export default App;
