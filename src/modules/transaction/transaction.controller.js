const { prisma, responses } = require("@/shared");

const create_transaction = async (req, res, next) => {
  try {
    const { title, amount, note, type, categoryId, date } = req.body;

    const userId = req.user.id;

    const transaction = await prisma.transaction.create({
      data: {
        title: title.trim(),
        amount,
        note: note?.trim() || null,
        type,
        date: new Date(date),
        userId,
        categoryId: type === "EXPENSE" ? Number(categoryId) : null,
      },
      include: {
        category: true,
      },
    });

    return res
      .status(201)
      .json(
        responses.create_success_response(
          { transaction },
          "Transaction created successfully.",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const get_transactions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { month, year, type, categoryId, search } = req.query;

    const { take, cursor } = get_cursor_pagination(req.query);

    const where = {
      userId,
    };

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 1);

      where.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    if (type && type !== "ALL") {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (search) {
      where.title = {
        contains: search,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      take: take + 1,
      ...cursor,
    });

    let nextCursor = null;

    if (transactions.length > take) {
      nextCursor = transactions.pop().id;
    }

    return res.status(200).json(
      responses.get_success_response(
        {
          transactions,
          nextCursor,
          hasMore: !!nextCursor,
        },
        "Transactions fetched successfully.",
      ),
    );
  } catch (error) {
    next(error);
  }
};

const update_transaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, amount, note, type, categoryId, date } = req.body;

    const userId = req.user.id;

    const transaction = await prisma.transaction.update({
      where: {
        id,
        userId,
      },
      data: {
        title: title.trim(),
        amount,
        note: note?.trim() || null,
        type,
        date: new Date(date),
        categoryId: type === "EXPENSE" ? Number(categoryId) : null,
      },
      include: {
        category: true,
      },
    });

    return res
      .status(200)
      .json(
        responses.update_success_response(
          { transaction },
          "Transaction updated successfully.",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const delete_transaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    await prisma.transaction.delete({
      where: {
        id,
        userId,
      },
    });

    return res
      .status(200)
      .json(
        responses.delete_success_response(
          null,
          "Transaction deleted successfully.",
        ),
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create_transaction,
  get_transactions,
  delete_transaction,
  update_transaction,
};
