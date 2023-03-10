class ProductQueryBuilder {
  constructor(limit, offset, searchMethod, sortingQuery, filterOptions) {
    this.limit = limit;
    this.offset = offset;
    this.searchMethod = searchMethod;
    this.sortingQuery = sortingQuery;
    this.filterOptions = filterOptions;
  }
  // product name, product description, option color, category name, product gender, option size,
  searchKeywordFilterBuilder(keyword) {
    return `WHERE p.name LIKE "%${keyword}%" OR p.description LIKE "%${keyword}%"`;
  }

  orderByBuilder() {
    return this.sortingQuery;
  }

  whenBuilder() {}

  limitBuilder() {
    return `LIMIT ${this.limit}`;
  }

  offsetBuilder() {
    return `OFFSET ${this.offset}`;
  }

  buildWhereClause() {
    const builderSet = {
      //orderBy: this.orderByBuilder,
      searchFilter: this.searchTypeFilterBuilder,
    };

    let whereClauses = this.searchKeywordFilterBuilder(this.searchMethod);
    console.log(whereClauses);
    /*
    whereClauses += Object.entries(this.filterOptions).map(([key, value]) =>
      builderSet[key](value)
    );

    if (whereClauses.length != 0) {
      return `WHERE ${whereClauses.join(" OR ")}`;
    }*/
  }

  build() {
    const filterQuery = [
      this.buildWhereClause(),
      this.orderByBuilder(),
      this.limitBuilder(),
      this.offsetBuilder(),
    ];

    return filterQuery.join(" ");
  }
}

module.exports = { ProductQueryBuilder };
