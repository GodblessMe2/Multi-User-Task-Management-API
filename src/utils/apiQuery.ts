class APIQuery<T> {
  query: any; // Change to any since QueryBuilder is not strictly typed for this context
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Apply filters to the QueryBuilder instance
    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key]) {
        this.query.andWhere(`task.${key} = :${key}`, { [key]: queryObj[key] });
      }
    });

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query.orderBy(sortBy); // QueryBuilder orderBy method
    } else {
      this.query.orderBy("task.createdAt", "DESC"); // Default sort by createdAt
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(",")
        .map((field: string) => `task.${field}`)
        .join(", ");
      this.query.select(fields); // QueryBuilder select method
    } else {
      this.query.select(["task"]); // Default to selecting all fields of "task"
    }
    return this;
  }

  paginate(): this {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit); // QueryBuilder pagination methods
    return this;
  }
}

export default APIQuery;
