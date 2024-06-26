"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/validator.js");

module.exports = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;
        validator.slugCharacterValidator(data.Slug)
        validator.slugLeadingSlashValidator(data.Slug)
        validator.slugNoLeadingDashValidator(data.Slug)
        validator.slugNoTrailingDashValidator(data.Slug)
    },
    beforeUpdate(event) {
        const { data, where, select, populate } = event.params;
        validator.slugCharacterValidator(data.Slug)
        validator.slugLeadingSlashValidator(data.Slug)
        validator.slugNoLeadingDashValidator(data.Slug)
        validator.slugNoTrailingDashValidator(data.Slug)
    }
};
