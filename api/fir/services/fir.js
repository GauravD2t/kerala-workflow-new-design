'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    firByBatch(params,populate){
        return strapi.query('fir').find(params,populate);
      },
      firdelete(params,populate){
        return strapi.query('fir').delete(params,populate);
       
      }
};
