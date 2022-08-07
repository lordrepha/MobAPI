# MobAPI
A node.js API

## Installation

1. `git clone git@github.com:CodingRuo/MobAPI.git`
2. npm install || npm i
3. Start server (for dev env `npm run dev`, for prod env `npm run start`)

## Configuration
Create a file in root with name config.json.

Example

    {
        "database": {
            "type": "MongoDB",
            "host": "localhost",
            "port": 1337,
            "crediantials": {
                "username": "",
                "password": ""
            },
            "name": "MobAPI"
        },
        "noDatabase": false
    }

MongoDB: connect to database withaut credentials remove key 'database.credentials'

### database init:

    "database": {
        "type": "MongoDB",
        "host": "localhost",
        "port": 1337,
        "user": "root",
        "password": "",
        "name": "test"
    }

possible database are ['MongoDB']

    "noDatabase": false init no database

## Structure
STANDARDTEMPLATE for API
    server/database/selected database/mainTemplates.js 
    
With CUSTOMTEMPLATE are possible extend the STANDARDTEMPLATE. 
    server/custom/mycustomtemplate.js 
    
**Warning dont insert code in STANDARDTEMPLATE, you can add code in CUSTOMTEMPLATE**

Insert new Table in file
    server/database/tables.json

You can extend the STANDARDTEMPLATE with custom code. 
1. create a ne file in server/custom/ with name like your table
2. Insert a hook or methode. 

### Example

Hook

    {% block updateBefore %}
        This code is running before update
    {% endblock %}

Methode

    {% block methodeUpdate %}
        This code replaced the standard update methode
    {% endblock %}

## Hooks / Methodes
Possible hooks in CUSTOMTEMPLATE
- updateBefore / updateAfter
- findBefore / findAfter
- findOneBefore / findOneAfter
- deleteBefore / deleteAfter
- countBefore / countAfter

Possible methodes in CUSTOMTEMPLATE
- methodeConstructor
- methodeUpdate
- methodeFindeOne
- methodeFind
- methodeDelete
- methodeCount

### Hook example
    {% block updateBefore %}{% endblock %}
    
### items in Hook
available item in Hook are:
    - result:   result from the database
    - request:  request from the client see [params](https://github.com/CodingRuo/MobAPI/blob/master/README.
    md#parameter)
    - _dirname: root directory

## DATA API Calls
this is the API for `https://url/data/` request.

## get
    find 
    findOne
    count
    
### Example:
    get first item from database with id = '1'
    `https://url/data/:table/findOne?_id=1`

    get alls item from database with group = 'foo'
    `https://url/data/:table/find?group=foo`
    
:table i the endpoint from the API normally Databasetable
    
## post
    find 
    findOne
    delete
    update
    count
    
### Parameter
    {
        table
        query
        body
        actions
    }
    
- table:    (String) Databasetable
- query:    (Object) Select data from DB
- body:     For Update new updated item
- actions:  Hook for custom actions
    
### Example:
    get first item from database with _id = '1'
    `https://url/data/:table/findOne`
    {
        "query": {
            "_id": "1"
        }
    }

    get alls item from database with group = 'foo'
    `https://url/data/:table/find`
    {
        "query": {
            "group": "foo"
    }

:table i the endpoint from the API normally Databasetable

## CUSTOM API Calls
this is the API for `https://url/custom/` request.

## all (get, post, put ...)
    everything what you want
    
### Example:
    `https://url/custom/:class/:action
    
:class is the class :action is the methode frpm the class
    
### Parameter
    {
        ctx
        query
    }
    
- ctx:      complete request from KOA
- query:    (Object) Select data from DB
    

#Templates
## default DATA Template
this template is for custom/data/:table request

    {% extends _dirname + '/server/database/' + database + '/mainTemplate.js' %}

    {% block main %}{% endblock %}
    
    //insert hooks or methods here 
    
## default CUSTOM Template
this template is for custom/custom/:class request

    {% extends _dirname + '/server/database/customTemplate.js' %}

    {% block main %}{% endblock %}

    {% block methodeFunction %}
        //write methods here
    {% endblock %} 




