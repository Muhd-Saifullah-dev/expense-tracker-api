const { prisma } = require("@shared/index");

const prismaErrorHandler = (error, req, res, next) => {

  if (error instanceof prisma.PrismaClientKnownRequestError) {

    switch (error.code) {

      case "P2000":
        return res.status(400).json({
          success: false,
          message: "Value too long for database column",
        });


      case "P2002":
        return res.status(409).json({
          success: false,
          message: "Duplicate record already exists",
          field: error.meta?.target,
        });


      case "P2003":
        return res.status(400).json({
          success: false,
          message: "Invalid relation. Related record does not exist",
        });


      case "P2011":
      case "P2012":
        return res.status(400).json({
          success: false,
          message: "Required field missing",
        });


      case "P2014":
        return res.status(400).json({
          success: false,
          message: "Relation violation",
        });


      case "P2021":
        return res.status(500).json({
          success: false,
          message: "Database table does not exist",
        });


      case "P2022":
        return res.status(500).json({
          success: false,
          message: "Database column does not exist",
        });


      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });


      default:
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
    }
  }


  if (error instanceof prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Invalid Prisma query data",
    });
  }


  if (error instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }


  next(error);
};


module.exports = prismaErrorHandler;