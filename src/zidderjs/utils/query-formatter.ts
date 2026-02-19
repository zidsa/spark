type ParamPrimitive = string | number | boolean | null | undefined;

type ParamValue = ParamPrimitive | ParamPrimitive[];

type AllPropsAreParamValue<T> = {
  [K in keyof T]: T[K] extends ParamValue ? T[K] : never;
};

export function formatQueryParams<T extends object>(
  params?: Partial<AllPropsAreParamValue<T>>,
): Record<string, string> {
  if (!params) {
    return {};
  }

  const queryParams: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((val, index) => {
        queryParams[`${key}[${index}]`] = String(val);
      });
    } else {
      queryParams[key] = String(value as ParamPrimitive);
    }
  });

  return queryParams;
}
