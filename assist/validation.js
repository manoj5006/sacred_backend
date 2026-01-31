

const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  console.log(req);
  
    const token = req.header('Authorization')?.split(' ')[1];
    console.log(token,"======>token");
    

    if (!token) {
        return res.status(403).json({ status: false, message: 'Access denied, token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'Invalid or expired token' });
        }
        req.user = user; 
        console.log(req.user,"=================req.user");
        
        next();
    });
};

const patterns = [
    { name: "email", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { name: "password", regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ },
  ];


  const findPatternName = (name) => {
    
    // Find the object in the array where the regex matches
    const patternObj = patterns.find((pattern) => pattern.name === name);

    console.log(patternObj);
    
    return patternObj ? patternObj.regex : null; // Return the name or null if not found
  };


const validateInput = async (type, value) => {

    let pattern =await findPatternName(type)

    console.log(pattern,"================>pattern");
    

    if (!pattern.test(value)) {
      return { isValid: false, message: `Invalid ${type} format` };
    }
  
    return { isValid: true , message: "success" };
  };


  module.exports ={
    validateInput,
    authenticateJWT
  }
