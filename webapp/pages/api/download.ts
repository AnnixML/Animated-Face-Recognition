
const fs = require("fs");
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data2 = await fs.readFileSync("outcsv.csv",{ encoding: 'utf8', flag: 'r' })
        console.log(data2)
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=outcsv.csv')
        res.end(data2)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
