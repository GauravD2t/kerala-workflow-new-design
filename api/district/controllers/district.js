'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async  getAllDistict(ctx){
       
     
        const entitys = await strapi.services.district.find({ "_limit": 2000},[]);
        console.log("entitys::::::"+entitys.length)
        if(entitys != null){
            return entitys.map(entity => sanitizeEntity(entity, { model: strapi.models.district }));
          }else{
              return [];
          }
    }
};
