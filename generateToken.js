const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = generateToken;

// if u want to expire the token
//return jwt.sign({ id }, process.env.JWT_SECRET, {
//    expiresIn: "20s",
//  });

// and to check that the token is expired or not you can use this in client side

//import jwtDecode from "jwt-decode";
// useEffect(() => {
//   const userInfo = JSON.parse(localStorage.getItem("userInfo"));

//   if (userInfo) {
//     const decodedToken = jwtDecode(token);
//     const expirationDate = new Date(decodedToken.exp * 1000);
//     if (expirationDate < new Date()) {
//       // Token has expired, navigate to login page
//       navigate("/chat");
//     }
//   } else {
//     console.log("not avaliable");
//   }
// }, []);
