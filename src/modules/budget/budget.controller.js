const { prisma, responses } = require("@/shared");

const create_budget = async (req, res, next) => {
  try {
    const { amount, month, year, categoryId } = req.body;

    const userId = req.user.id;

    const budget = await prisma.budget.create({
      data: {
        amount,
        month,
        year,
        userId,
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      },
    });

    return res
      .status(201)
      .json(
        responses.create_success_response(
          { budget },
          "Budget created successfully.",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const get_budgets = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { month, year } = req.query;

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        ...(month && { month: Number(month) }),
        ...(year && { year: Number(year) }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res
      .status(200)
      .json(
        responses.ok_response(
          { budgets },
          "Budgets fetched successfully.",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const update_budget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { amount, month, year, categoryId } = req.body;

    const budget = await prisma.budget.update({
      where: {
        id: Number(id),
      },
      data: {
        amount,
        month,
        year,
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      },
    });

    return res
      .status(200)
      .json(
        responses.update_success_response(
          { budget },
          "Budget updated successfully.",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const delete_budget = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.budget.delete({
      where: {
        id: Number(id),
      },
    });

    return res
      .status(200)
      .json(
        responses.delete_success_response(null, "Budget deleted successfully."),
      );
  } catch (error) {
    next(error);
  }
};
const single_budget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await prisma.budget.findFirst({
      where: {
        id: Number(id),
        userId,
      },
      include: {
        category: true,
      },
    });

    if (!budget) {
      return res
        .status(404)
        .json(responses.not_found_error("Budget not found."));
    }

    return res.status(200).json(
      responses.get_success_response(
        { budget },
        "Budget fetched successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};
module.exports = {
  delete_budget,
  update_budget,
  get_budgets,
  create_budget,
  single_budget
};
