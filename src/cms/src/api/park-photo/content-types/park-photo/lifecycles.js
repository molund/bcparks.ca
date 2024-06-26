"use strict";

const { indexPark } = require("../../../../helpers/taskQueue.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const getOrcs = async function (event) {
  let { where } = event.params;
  if (!where.id) {
    return null;
  }
  const photo = await strapi.entityService.findOne(
    "api::park-photo.park-photo",
    where.id,
    {
      fields: ["orcs"],
    }
  );
  return photo?.orcs;
};

const getProtectedAreaIdByOrcs = async function (orcs) {
  if (!orcs) {
    return null;
  }
  const parks = await strapi.entityService.findMany(
    "api::protected-area.protected-area",
    {
      fields: ["id"],
      filters: {
        orcs: orcs,
      },
    }
  );
  if (!parks.length) {
    return null;
  }
  return parks[0]?.id;
};

module.exports = {
  async afterCreate(event) {
    const protectedAreaId = await getProtectedAreaIdByOrcs(event.result?.orcs);
    await indexPark(protectedAreaId);
  },
  async afterUpdate(event) {
    const newProtectedAreaId = await getProtectedAreaIdByOrcs(event.result?.orcs);
    await indexPark(newProtectedAreaId);
  },
  async beforeUpdate(event) {
    const oldOrcs = await getOrcs(event);
    const oldProtectedAreaId = await getProtectedAreaIdByOrcs(oldOrcs);
    await indexPark(oldProtectedAreaId);
  },
  async beforeDelete(event) {
    const orcs = await getOrcs(event);
    const protectedAreaId = await getProtectedAreaIdByOrcs(orcs);
    await indexPark(protectedAreaId);
  }
};
