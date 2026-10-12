const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async batchesfindAllbyCreatedby(ctx) {
        //console.log("batch Controller")
        //console.log(ctx.query)
        // const entitys  = await strapi.services.batch.find(ctx.query);
        const entitys = await strapi.services.batch.find(ctx.query, ['firs', 'inwardcommited_by', 'created_by_d2', 'outwardcommited_by', 'receivecommited_by', 'filetagcommitted_by']);
        if (entitys != null) {
            return entitys.map(entity => sanitizeEntity(entity, { model: strapi.models.batch }));
        } else {
            return [];
        }
    },
    async findOnebyCreated(ctx) {

        const entity = await strapi.services.batch.findOne(ctx.query, ['filetagcommitted_by', 'inwardcommited_by', 'firs', 'created_by_d2', 'outwardcommited_by', 'receivecommited_by']);
        if (entity != null) {
            return sanitizeEntity(entity, { model: strapi.models.batch, status: true });
        } else {
            return { status: false };
        }

    },
    async retriveBatchUpdateFIR(ctx) {

        const entitys = await strapi.query('fir').find({ batch: ctx.params.id, _limit: -1 });

        if (entitys != null) {
            entitys.forEach((entry) => strapi.query('fir').update({ id: entry.id }, { inwardstatus: 1, imagestatus: 0 }));
        }
        const entity = await strapi.query('batch').update(ctx.params, ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.batch });


    },
    async retriveBatchUpdateFIRFileTag(ctx) {

        const entitys = await strapi.query('fir').find({ batch: ctx.params.id, _limit: -1 });

        if (entitys != null) {
            entitys.forEach((entry) => {
                if (entry.inwardstatus == 1) {
                    strapi.query('fir').update({ id: entry.id }, { tagstatus: true, imagestatus: 0 })
                }
            });
        }
        const entity = await strapi.query('batch').update(ctx.params, ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.batch });


    },
    async retriveBatchUpdateFIRReurnStatus(ctx) {
        const entitys = await strapi.query('fir').find({ batch: ctx.params.id, _limit: -1 });
        if (entitys != null) {
            entitys.forEach((entry) => {
                strapi.query('fir').update({ id: entry.id }, { returnstatus: 1, imagestatus: 0 })
            });
        }
        const entity = await strapi.query('batch').update(ctx.params, ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.batch });


    },
    async FileBulkTag(ctx) {
        try {
            const entitys = await strapi.query('batch').find(ctx.query);
            entitys.forEach((entry) => {
                if (!entry.blocked || (entry.blocked && blocked.filetagcommitted_by.id == ctx.params.filetagcommitted_by)) {
                    strapi.query('batch').update({ id: entry.id }, { filetagreceive_at: new Date(), filetagcommitted_at: new Date(), batchstatus: 3, filetagcommitted_by: ctx.params.filetagcommitted_by, islock: false });
                    strapi.query('fir').find({ batch: entry.id, _limit: -1 }).then(firsdata => {
                        if (firsdata != null) {
                            firsdata.forEach((entry1) => {
                                if (entry1.inwardstatus == 1) {
                                    strapi.query('fir').update({ id: entry1.id }, { tagstatus: true, imagestatus: 0 })
                                }
                            });
                        }
                    });
                }
            });
            return { status: true };
        } catch (error) {
            return { status: false };
        }


    },
    async receiveBulkTag(ctx) {
        try {

            const entitys = await strapi.query('batch').find(ctx.query);
            entitys.forEach((entry) => {
                if (!entry.blocked || (entry.blocked && blocked.receivecommited_by.id == ctx.params.receivecommited_by)) {
                    strapi.query('batch').update({ id: entry.id }, { receive_at: new Date(), receivecommited_at: new Date(), batchstatus: 8, receivecommited_by: ctx.params.receivecommited_by, islock: false });
                    strapi.query('fir').find({ batch: entry.id, _limit: -1 }).then(firsdata => {
                        if (firsdata != null) {
                            firsdata.forEach((entry1) => {
                                strapi.query('fir').update({ id: entry1.id }, { returnstatus: 1 }, { imagestatus: 0 })
                            });
                        }
                    });
                }
            });
            return { status: true };
        } catch (error) {
            return { status: false };
        }


    }


};
