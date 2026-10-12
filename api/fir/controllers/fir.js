'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async firsByBatch(ctx) {
    const { batch } = ctx.params;
    const entitys = await strapi.services.fir.firByBatch({ batch, _sort: 'id:desc', _limit: -1 });
    if (entitys != null) {
      return entitys.map(entity => sanitizeEntity(entity, { model: strapi.models.fir }));
    } else {
      return [];
    }
  },
  async findfirbyQuery(ctx) {
    console.log("fir Controller")
    console.log(ctx.query)
    // const entitys  = await strapi.services.batch.find(ctx.query);
    const entitys = await strapi.services.fir.find(ctx.query, ['batch', 'batch.created_by_d2', 'scan_by', 'qc_by', 'classification_by', 'verify_by', 'classificationqc_by', 'batch.inwardcommited_by', 'secondverify_by', 'metadatavalues', 'metadatavalues.metadatum', 'first_verify_by', 'thirdverify_by','pdf_by']);
    if (entitys != null) {
      return entitys.map(entity => sanitizeEntity(entity, { model: strapi.models.batch }));
    } else {
      return [];
    }
  },
  async delteFRIbyBatch(ctx) {
    const { batch } = ctx.params;
    const entitys = await strapi.services.fir.firdelete({ batch });
    if (entitys != null) {
      return entitys.map(entity => sanitizeEntity(entity, { model: strapi.models.fir }));
    } else {
      return [];
    }
  },
  async taskassingFIR(ctx) {
    try {
      console.log("ctx.params.id::" + ctx.params.id)
      var count = 0;
      await strapi.query('fir').find(ctx.query).then(function (entitys) {
        entitys.forEach((entry) => {
          strapi.query('fir').update({ id: entry.id }, ctx.request.body).then(function (result) {
            count++;
            //result.batch.id;
            if (entitys.length == count) {
              strapi.query('fir').count({ batch: result.batch.id, inwardstatus_ne: 2, imagestatus: 0 }).then(function (counterentitys) {
                if (counterentitys == 0) {
                  console.log("update status in batch")
                  strapi.query('batch').update({ id: result.batch.id }, { batchstatus: 4, scanningreceive_at: new Date(), scanningcommited_at: new Date(), islock: false, scanningcommited_by: ctx.params.id })
                }

              });
            }
          });
        });
      });
      return { status: true };
    } catch (error) { return { status: false }; }
  }
};
