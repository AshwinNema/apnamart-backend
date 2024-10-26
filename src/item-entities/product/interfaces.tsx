interface createProductProcessedBody {
  name: string;
  itemId: number;
  price: number;
  merchant: number;
  description: {
    details:
      | string
      | {
          id?: string;
          header?: string;
          details?:
            | string
            | {
                id?: string;
                key?: string;
                val?: string;
              }[];
        }[];
  };
  specification:
    | string
    | {
        id?: string;
        header?: string;
        keyVals?: {
          id?: string;
          key?: string;
          val?: string;
        }[];
      }[];
  filterOptions: {
    connect: {
      id: number;
    }[];
  };
}
