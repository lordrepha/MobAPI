"use strict";
const debug         = require('debug')('app:server:database:MongoDB:Data');
const _dirname      = process.cwd();
const prod          = process.env.NODE_ENV !== 'production';
const uuid          = require('uuid');
const config        = require(_dirname + '/config');
const z             = require("zod");

const update = z.object({
    auth:       z.boolean(),
    table:      z.string(),
    body:       z.object({}),
    query:      z.object({
        _id:        z.string().optional()
    }).optional(),
    cmd:        z.object().optional(),
    options:    z.object().optional(),
});

const _delete = z.object({ 
    auth:       z.boolean(),
    table:      z.string(),
    query:      z.object({})
})

const findOne = z.object({ 
    auth:       z.boolean(),
    table:      z.string(),
    query:      z.object({})
})

const find = z.object({
    auth:       z.boolean(),
    query:      z.object({}),
    table:      z.string(),
    sort:       z.object({}).optional(),
    skip:       z.number().optional(),
    limit:      z.number().optional()
})

const count = z.object({ 
    auth:       z.boolean(),
    table:      z.string(),
    query:      z.object({})
})

module.exports = class Data {
    
    constructor(  ) {

    }

    async initDb ( ) {
        const Connection        = require( _dirname + '/server/database/MongoDB/Connection.js');
        let connection          = new Connection();
        const db                = await connection.init();     
        return db;
    }


    async update ( request ) {
        try{
            config.debug.extend && debug('update params: ', request );

            update.parse(request)

            if ( !request.auth )
                throw('Not Authorized')

            const db    = await this.initDb();
            
            if ( request.body && !request.body._id ) {
                const id = uuid.v4();
                console.error('No _id found in body generate ID: ', id);
                request.body._id    = id;
            }

            if ( request.query && request.query._id )
                request.body._id = request.query._id;

            let query   = request.query || { _id: request.body._id }

            const res = await db.collection(request.table).updateOne(
                query, 
                request.cmd ? request.cmd : { $set: 
                    request.body || {}
                },
                request.options || { upsert: true }
            );

            if ( res.acknowledged ) {
                const result = await db.collection(request.table).findOne(
                    { _id: request.body._id }
                );

                return { data: result, inserted: res.upsertedId ? true : false, updated: res.modifiedCount > 0 ? true : false, matched: res.matchedCount > 0 ? true : false }
            }

            throw({ error: 'Save abort' })
        } 
        catch (error) {
            console.error(error);
            return { error };
        }
    }

    async delete ( request ) {
        try{
            config.debug.extend && debug('delete params: ', request );

            _delete.parse(request)

            if ( !request.auth )
                throw('Not Authorized')

            const db = await this.initDb();

            if ( Object.keys(request.query).length === 0 )
                throw('Query Empty')

            const res = await db.collection(request.table).deleteOne(
                request.query
            );

            if ( res.acknowledged )
                return { data: res.deletedCount }

            throw(res)
        } 
        catch (error) {
            console.error(error);
            return { error };
        }
    }

    async findOne ( request ) {
        try {
            config.debug.extend && debug('findOne params: ', request );

            findOne.parse(request)

            if ( !request.auth )
                throw('Not Authorized')

            const db = await this.initDb();

            const result = await db.collection(request.table).findOne(
                request.query
            );

            const count = await db.collection(request.table).count();

            return { data: result, total: count }
        } catch (error) {
            console.error(error);
            return { error };
        }
    }

    async find ( request ) {
        try {
            config.debug.extend && debug('find params: ', request );

            find.parse(request)

            if ( !request.auth )
                throw('Not Authorized')
            
            const db = await this.initDb();

            const result = await db.collection(request.table).find(
                request.query
            )
            .sort( request.sort || null )
            .skip( request.skip || 0 )
            .limit( request.limit || 0 )
            .toArray();

            const count = await db.collection(request.table).count();

            return { data: result, total: count }
        } catch (error) {
            console.error(error);
            return { error };
        }
    }

    async count ( request ) {
        try {
            config.debug.extend && debug('count params: ', request );

            count.parse(request);

            if ( !request.auth )
                throw('Not Authorized')

            const db = await this.initDb();

            const result = await db.collection(request.table).count(
                request.query
            );

            return { data: result }
        } catch (error) {
            console.error(error);
            return { error };
        }
    }
}