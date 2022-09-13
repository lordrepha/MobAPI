const _dirname  = process.cwd()
const Router    = require('@koa/router');
const multer    = require('@koa/multer');
const upload    = multer()
const router    = new Router({
    prefix: '/upload'
});

let io;

router.init  = function( socket ) {
    io    = socket;
};

router
    .post("/:class/:action", upload.single('upload'), async (ctx, next) => {
        
        const Custom        = require(`${_dirname}/server/database/customApi/${ctx.params.class}.js`);
        const custom        = new Custom();
        let result          = {data: null};

        if ( custom[ctx.params.action] )
            result.data = await custom[ctx.params.action]( { body: ctx.request.body, ctx, io } )
        else {
            console.error( 'No action found. Called action: ', ctx.params.action )

            ctx.status  = result.error ? 400 : 200;
            ctx.body    = result;
        }
    })

module.exports = router;
