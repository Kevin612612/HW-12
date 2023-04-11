
//Presentation Layer


import {Request, Response, Router} from "express";

import {db} from "../repositories/mongodb";
import {BlogModel, CommentModel, PostModel, RefreshTokenModel, UserModel} from "../repositories/mogoose";

export const testingRouter = Router({})

//delete all-data
testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    /*const a = await db.collection<blogViewModel>("blogs").deleteMany({})
    const b = await db.collection<postViewModel>("posts").deleteMany({})
    const c = await db.collection<userViewModel>("users").deleteMany({})
    const d = await db.collection<commentViewModel>("comments").deleteMany({})

    const result1 = await db.collection<blogViewModel>("blogs").find({}).toArray()
    const result2 = await db.collection<blogViewModel>("posts").find({}).toArray()
    const result3 = await db.collection<userViewModel>("users").find({}).toArray()
    const result4 = await db.collection<userViewModel>("comments").find({}).toArray()

    if (result1.length == 0 && result2.length == 0 && result3.length == 0 && result4.length == 0) {
        res.send(204)
    }*/

    // const collections = ["blogs", "posts", "users", "comments", "refreshTokens"]
    // //deleting using mongoDB
    // const deleteEachCollection = collections.map(collection => db.collection(collection).deleteMany({}))
    // const result = await Promise.all(deleteEachCollection)
    //
    // //getting
    // const results = []
    // for (const collection of collections) {
    //     results.push(await db.collection(collection).find({}).toArray())
    // }
    //
    // //check if everything was deleted
    // if (results.flat().length == 0) {
    //     res.send(204)
    // }


    //deleting using mongoose
    await BlogModel.deleteMany({})
    await PostModel.deleteMany({})
    await UserModel.deleteMany({})
    await CommentModel.deleteMany({})
    await RefreshTokenModel.deleteMany({})

    const result_1 = await BlogModel.find({}).lean()
    const result_2 = await PostModel.find({}).lean()
    const result_3 = await UserModel.find({}).lean()
    const result_4 = await CommentModel.find({}).lean()
    const result_5 = await RefreshTokenModel.find({}).lean()

    const results1 = []
    results1.push(result_1, result_2, result_3, result_4, result_5)

    if (results1.flat().length == 0) {
        res.sendStatus(204)
    }

})