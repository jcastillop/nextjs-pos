import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //res.status(200).json({ message: 'John Doe' })} 
  switch (req.method) {
    case 'POST':
      return res.status(400).json({ message: 'Bad request' })
      //return createOrder(req, res)
      break;
  
    default:
      return res.status(400).json({ message: 'Bad request' })
      break;
  }
}
const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.status(201).json({ message: 'John Doe' })
}

