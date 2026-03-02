type ParamPrimitive = string | number | boolean | null | undefined;

type ParamValue = ParamPrimitive | ParamPrimitive[];

type AllPropsAreParamValue<T> = {
  [K in keyof T]: T[K] extends ParamValue ? T[K] : never;
};

const createSearchParams = <T extends object>(
  params: Partial<AllPropsAreParamValue<T>>,
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(`${key}[]`, String(item)));
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, String(value as ParamPrimitive));
    }
  });

  return searchParams;
};

export { createSearchParams };
