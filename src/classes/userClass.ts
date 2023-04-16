
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import {codeDataType, userAccountDataType, conformationType, TokenType} from "../types/users";
import {createUserId} from "../application/findNonExistId";


export class User {
    public _id: ObjectId
    public accountData: userAccountDataType
    public emailConfirmation: conformationType
    public emailCodes: codeDataType[];
    public passwordConfirmation: { confirmationCode: string; expirationDate: Date }
    public passwordCodes: codeDataType[]
    public tokens: {
        accessTokens: TokenType[],
        refreshTokens: TokenType[]
    }

    constructor(public id: string = 'no id',
                public login: string = 'no login',
                public email: string = 'no email',
                public passwordSalt: string = 'no salt',
                public passwordHash: string = 'no hash',
                ) {
        this._id = new ObjectId()
        this.id = id
        this.accountData = {
            login: login,
            email: email,
            passwordSalt: passwordSalt,
            passwordHash: passwordHash,
            createdAt: new Date(),
        }
        this.emailConfirmation = {
            confirmationCode: this.generateCode(),
            expirationDate: this.addTime(12, 0, 0),
            isConfirmed: false,
        }
        this.emailCodes = [{
            code: this.emailConfirmation.confirmationCode,
            sentAt: new Date(),
        }]
        this.passwordConfirmation = {
            confirmationCode: this.generateCode(),
            expirationDate: this.addTime(12, 0, 0),
        }
        this.passwordCodes = [{
            code: this.passwordConfirmation.confirmationCode,
            sentAt: new Date(),
        }]
        this.tokens = {
            accessTokens: [],
            refreshTokens: [],
        }
    }

    public async addAsyncParams(login: string,
                     email: string,
                     password: string) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const userId = await createUserId()
        return new User(userId, login, email, salt, hash)
    }


    private generateCode() {
        return Math.floor(Math.random() * 10000).toString()
    }

    private addTime(hours: number = 0, minutes: number = 0, seconds: number = 0) {
        let newDate = new Date()
        newDate.setHours(newDate.getHours() + hours)
        newDate.setMinutes(newDate.getMinutes() + minutes)
        newDate.setSeconds(newDate.getSeconds() + seconds)
        return newDate
    }

}