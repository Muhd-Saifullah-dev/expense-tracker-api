const { prisma, responses, get_cursor_pagination } = require("@/shared");

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

    const {
      startDate,
      endDate,
      type,
      categoryId,
      search,
    } = req.query;

    const { take, cursor } = get_cursor_pagination(req.query);

    const where = {
      userId,
    };

    // Date Range
    if (startDate || endDate) {
      where.date = {};

      if (startDate) {
        where.date.gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // pura din include hoga

        where.date.lte = end;
      }
    }

    // Type
    if (type && type !== "ALL") {
      where.type = type;
    }

    // Category
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    // Search
    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
     orderBy: [
    {
      date: "desc",
    },
    {
      id: "desc",
    },
  ],
      take: take + 1,
      ...cursor,
    });

    let nextCursor = null;

    if (transactions.length > take) {
      nextCursor = transactions.pop().id;
    }

    return res.status(200).json(
      responses.ok_response(
        {
          transactions,
          nextCursor,
          hasMore: !!nextCursor,
        },
        "Transactions fetched successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

const update_transaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, amount, note, } = req.body;

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

const get_single_transaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        
      },
    });

    if (!transaction) {
      return res.status(404).json(responses.not_found_error("transaction not found"));
    }

    return res.status(200).json(responses.ok_response(transaction,"transaction get successfully"));
  } catch (error) {
    next(error);
  }
};
module.exports = {
  create_transaction,
  get_transactions,
  delete_transaction,
  update_transaction,
  get_single_transaction
};
