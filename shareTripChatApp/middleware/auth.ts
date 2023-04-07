require("dotenv").config();
import jsonwebtoken from 'jsonwebtoken'

module.exports = (req, res, next) => {
	try {
		const token = req.cookies["access_token"];
		if (token === undefined) {
			throw new Error("User not authentified");
		}
        console.log(token);
		const decodedToken = jsonwebtoken.verify(token, process.env.JWT_PRIVATE_KEY);
        console.info('From the auth middleware : DECODED_TOKEN ' + decodedToken);
		req.auth = {
           userId: decodedToken
       };
		next();
	} catch (err) {
		res.status(401).json({"Error": err.message, "Details": 'User not authentified'})
  }
};
