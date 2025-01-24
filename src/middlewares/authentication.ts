import { NextFunction, Request, Response } from 'express'
import { config } from 'dotenv'

config()

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['proxy-authorization']?.replace('Basic ', '')

  if (!token) {
    return res.status(401).end()
  }

  const decodedToken = Buffer.from(token, 'base64').toString('ascii')

  const [user, password] = decodedToken.split(':')

  if (
    !user ||
    !password ||
    user !== process.env['PROXY_USER'] ||
    password !== process.env['PROXY_PASSWORD']
  ) {
    return res.status(401).end()
  }
  return next()
}
