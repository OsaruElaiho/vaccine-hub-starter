const db = require("../db")
const {UnauthorizedError, BadRequestError} = require("../utils/errors")

class User{
    static async login(credentials){
    
        throw new UnauthorizedError("Invalid email or password")
    }

    static async register(credentials){
        const requiredFields = ["email", "password", "firstName", "lastName", "date", "location"]
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })

        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        const lowercasedEmail = credentials.email.toLowerCase()

        const result = await db.query(
            ` INSERT INTO users (
                email,
                password, 
                first_name,
                last_name,
                date,
                location
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, first_name, last_name, location, date
            `,
            [lowercasedEmail, credentials.password, credentials.firstName, credentials.lastName, credentials.date, credentials.location]
        )

        const user = result.rows[0]
        return user
        
    }

    static async fetchUserByEmail(email) {
        if(!email){
            throw new BadRequestError("No email provided")
        }
        const query = `SELECT * FROM users WHERE email = $1`
        const result = await db.query( query, [email.toLowerCase()])
    
        const user = result.rows[0]
    
        return user
    }


}

module.exports = User