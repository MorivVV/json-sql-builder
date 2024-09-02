export const comparator = (field: Record<string, number>) => {
    var len = 0;
    var fields: any[], orders: any[];
    if (typeof field === "object") {
      fields = Object.getOwnPropertyNames(field);
      orders = fields.map((key) => field[key]);
      len = fields.length;
    } 
    return (a: any, b: any) => {
      for (let i = 0; i < len; i++) {
        if (a[fields[i]] < b[fields[i]]) return -orders[i];
        if (a[fields[i]] > b[fields[i]]) return orders[i];
      }
      return 0;
    };
  }

  