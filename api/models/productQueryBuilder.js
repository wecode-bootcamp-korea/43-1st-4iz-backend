class ProductQueryBuilder {
  constructor(limit, offset, search, sort, filters) {
    this.limit = limit;
    this.offset = offset;
    this.search = search;
    this.sort = sort;
    this.filters = filters;
    this.searchTypes = [
      `p.name`,
      `p.description`,
      `o.color`,
      `category`,
      `p.gender`,
      `o.size`,
    ];
  }

  sortFilterBuilder() {
    switch (this.sort) {
      case "date":
        return `ORDER BY p.release_date DESC`;
      case "high":
        return `ORDER BY p.price DESC`;
      case "low":
        return `ORDER BY p.price ASC`;
      default:
        return `ORDER BY p.release_date DESC`;
    }
  }

  searchFilterBuilder(keyword) {
    const searchTypesLength = this.searchTypes.length;
    let clause = [];

    for (
      let searchTypeIndex = 0;
      searchTypeIndex < searchTypesLength;
      searchTypeIndex++
    ) {
      clause.push(this.searchTypes[searchTypeIndex] + ` LIKE "%${keyword}%"`);
    }

    if (clause.length !== 0) {
      clause = `${clause.join(" OR ")}`;
    }

    clause = `WHERE ` + clause;

    return keyword === "" ? "" : clause;
  }

  categoryFilterBuilder(category) {
    return `category LIKE "%${category}%"`;
  }

  genderFilterBuilder(gender) {
    return `p.gender IN (${gender})`;
  }

  sizeFilterBuilder(size) {
    return `o.size IN (${size})`;
  }

  colorFilterBuilder(color) {
    return `o.color IN (${color})`;
  }

  orderByBuilder() {
    return this.sortFilterBuilder();
  }

  limitBuilder() {
    return `LIMIT ${this.limit}`;
  }

  offsetBuilder() {
    return `OFFSET ${this.offset}`;
  }

  groupByBuilder() {
    return `GROUP BY p.id`;
  }

  buildWhereClause() {
    const builderSet = {
      categoryFilter: this.categoryFilterBuilder,
      genderFilter: this.genderFilterBuilder,
      sizeFilter: this.sizeFilterBuilder,
      colorFilter: this.colorFilterBuilder,
    };

    let searchClause = this.searchFilterBuilder(this.search);

    let filterClause = Object.entries(this.filters).map(([key, value]) => {
      switch (key) {
        case "category":
          return builderSet["categoryFilter"](value);
        case "gender":
          return builderSet["genderFilter"](value);
        case "color":
          return builderSet["colorFilter"](value);
        case "size":
          return builderSet["sizeFilter"](value);
      }
    });

    if (filterClause.length !== 0) {
      filterClause = `${filterClause.join(" OR ")}`;

      if (searchClause.length !== 0) {
        filterClause = "OR " + filterClause;
      } else {
        filterClause = "WHERE " + filterClause;
      }
    }

    const completeClause = searchClause + filterClause;

    return completeClause;
  }

  build() {
    const filterQuery = [
      this.buildWhereClause(),
      this.groupByBuilder(),
      this.orderByBuilder(),
      this.limitBuilder(),
      this.offsetBuilder(),
    ];

    return filterQuery.join(" ");
  }
}

module.exports = { ProductQueryBuilder };
