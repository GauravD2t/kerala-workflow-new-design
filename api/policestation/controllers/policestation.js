'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');
module.exports = {
    async policestationswithdistrict(ctx) {
        const { id } = ctx.params;
        console.log(id)
        const entity = await strapi.services.policestation.findOnewithstateanddistrict({ id },[ 'district',"district.state"]);
        return sanitizeEntity(entity, { model: strapi.models.policestation });
    },
    /*async find(ctx) {
        const { id } = ctx.params;
        console.log(id)
        const entity = await strapi.services.policestation.find({ id },[ 'district',"district.state"]);
        return sanitizeEntity(entity, { model: strapi.models.policestation });
    }*/
    
};
