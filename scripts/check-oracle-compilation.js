const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Function to recursively gather all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (path.extname(filePath) === '.sol') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Get all Solidity files in our oracle directory
const oracleDir = path.join(__dirname, '..', 'contracts', 'oracle');
const files = getAllFiles(oracleDir);

// Create a map of file paths to their content
const sources = {};
files.forEach(file => {
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  sources[relativePath] = { content: fs.readFileSync(file, 'utf8') };
});

// Configure compiler input
const input = {
  language: 'Solidity',
  sources,
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    },
    optimizer: {
      enabled: true,
      runs: 1000
    }
  }
};

// Compile the contracts
console.log('Compiling Oracle contracts...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for errors
if (output.errors) {
  console.error('Compilation errors:');
  output.errors.forEach(error => {
    console.error(error.formattedMessage);
  });
  process.exit(1);
} else {
  console.log('Compilation successful!');
}
