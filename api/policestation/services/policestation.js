'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    findOnewithstateanddistrict(params, populate) {
        console.log(populate)
        return strapi.query('policestation').findOne(params, populate);
    }
};
