import { express, Request, Response, NextFunction } from 'express'

module.exports = (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        res.statusCode < 300 
            ?
            console.info(`INFO:     ${req.socket.remoteAddress.substring(7)}:${req.socket.remotePort} - "${req.method} ${req.url} ${req.protocol.toUpperCase()}" ${res.statusCode} OK`)
            :
            console.info(`INFO:     ${req.socket.remoteAddress.substring(7)}:${req.socket.remotePort} - "${req.method} ${req.url}" ${res.statusCode} ${res.statusMessage}`)
    })
    next()
}
