"use strict";

module.exports = {
  getdrivers: async (event, next) => {
    let { status = "", companyId = null } = event.request.body;
// 
    const ctx = strapi.requestContext.get();
    const userId = ctx.state?.auth?.credentials?.id;
    if (ctx.state?.auth?.credentials?.user_role === "company") {
      companyId = ctx.state?.auth?.credentials?.id;
    } else if (ctx.state?.auth?.credentials?.user_role === "agent") {
      companyId = ctx.state?.auth?.credentials?.company_id;
    } else {
      companyId = companyId;
    }
    try {
      var drivers = strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          populate: {
            accountOverview: {
              fields: [
                "firstName",
                "lastName",
                "cin",
                "isFree",
                "rating",
                "isActive",
              ],
              populate: { vehicule_id: true },
            },
          },
          fields: [
            "id",
            "email",
            "user_role",
            "phoneNumber",
            "username",
            "createdAt",
            "updatedAt",
          ],
          filters: {
            $and: [
              {
                user_role: "driver",
              },
              companyId
                ? {
                    company_id: companyId,
                  }
                : {},
            ],
          },
        }
      );
      return drivers;
    } catch (err) {
      event.body = err;
    }
  },
  getcompany: async (ctx, next) => {
    try {
      var companies = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          fields: [
            "id",
            "email",
            "user_role",
            "blocked",
            "confirmed",
            "phoneNumber",
            "username",
            "createdAt",
            "updatedAt",
          ],
          populate: {
            accountOverview: { populate: "*" },
            profile_picture: true,
            validation: true,
          },

          filters: {
            $and: [
              {
                user_role: "company",
              },
              { validation: { validation_state: { $eq: "valid" } } },
            ],
          },
        }
      );

      return companies;
    } catch (err) {
      ctx.body = err;
    }
  },

  /*--------------------------------------------- GET Vehicule List*/

  getvehicule: async (event, next) => {
    let { status = "", companyId = null } = event.request.body;
    const ctx = strapi.requestContext.get();
    const userId = ctx.state?.auth?.credentials?.id;
    if (ctx.state?.auth?.credentials?.user_role === "company") {
      companyId = ctx.state?.auth?.credentials?.id;
    } else if (ctx.state?.auth?.credentials?.user_role === "agent") {
      companyId = ctx.state?.auth?.credentials?.company_id;
    } else {
      companyId = companyId;
    }
    try {
      var companies = await strapi.entityService.findMany(
        "api::vehicule.vehicule",
        {
          fields: [
            "id",
            "mark",
            "model",
            "year",
            "color",
            "matriculation",
            
            "createdAt",
            "updatedAt",
            "assuranceDate",
          ],
          populate: {
            company_id: {
              fields: ["id", "email", "user_role", "phoneNumber", "username"],
              populate: {
                accountOverview: {
                  on: {
                    "section.company": { fields: ["name"] },
                  },
                },
              },
            },
            validation: true,
            vehiculePictureface2: true,
            vehiculePictureface3: true,
            vehiculePictureface4: true,
            vehiculePictureface1: true,
          },

          filters: {
            $and: [
              { validation: { validation_state: { $eq: "valid" } } },
              companyId
                ? {
                    company_id: { id: companyId },
                  }
                : {},
            ],
          },
        }
      );

      return companies;
    } catch (err) {
      event.body = err;
    }
  },
};
